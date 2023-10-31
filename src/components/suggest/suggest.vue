<template>
  <scroll
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    :beforeScroll="beforeScroll"
    :pullup="pullup"
    :dataInfo="result"
    class="suggest"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem($event, item)"
        class="suggest-item"
        v-for="(item, i) in result"
        :key="i"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>
<script>
// 方法
import { search } from "api/search";
import { ERR_OK, HTTP_OK } from "api/config";
import { createSong, getSong } from "common/js/song2";
import Singer from "common/js/singer";
import { mapMutations, mapActions } from "vuex";
// 组件
import Scroll from "base/scroll/scroll";
import { Promise } from "q";
const NoResult = () => import("base/no-result/no-result");
const Loading = () => import("base/loading/loading");
// 常量
const TYPE_SINGER = "singer";
export default {
  props: {
    query: {
      type: String,
      default: "",
    },
    showSinger: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    // 监听输入框有text就触发搜索
    query(newVal) {
      this.search();
      //重置旧的搜索结果，重要！！！！
      this.result = [];
    },
  },
  data() {
    return {
      page: 1, // 当前页
      result: [], // 搜索返回的数据
      pullup: true, // 上拉加载
      hasMore: true, // 是否加载完全部
      perpage: 30, // 每页的条数
      beforeScroll: true,
    };
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    // 获取数据
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      // search(this.query, this.page, this.showSinger, this.perpage).then(
      //   (res) => {
      //     if (res.code === ERR_OK) {
      //       this._genResult(res.data).then((resp) => {
      //         this.result = this.result.concat(resp);
      //       });

      //       this.checkMore(res.data);
      //     }
      //   }
      // );
      const data = {
        query: this.query,
        limit: this.perpage,
        offset: (this.page - 1) * this.perpage,
      };
      search(data.query,data.limit,data.offset).then((res) => {
        if (res.code === HTTP_OK && res.result.songs.length >0) {
          this._normalizeSongs(res.result.songs).then((resp) => {
            this.result = this.result.concat(resp);
          });

          this.checkMore(res.result);
        }
      });
    },
    // 判断全部歌曲是否已经加载完毕
    checkMore(data) {
      console.log("checkmore收到数据==》",data)
      // let songs = data.songs;
      if ( 
        // data.songCount == 0  
        this.result.length >= data.songCount
        // (this.page - 1) * this.perpage + songs.length > data.songCount
      ) {
        this.hasMore = false;
      }
    },
    // 搜索的加载更多
    searchMore() {   
      console.log("searchMore 执行了。。。。。")
      if (!this.hasMore) {
        console.log("全部歌曲已加载完毕，没有更多记录了");
        return;
      }
      this.page++;
      const data = {
        query: this.query,
        limit: this.perpage,
        offset: (this.page - 1) * this.perpage,
      };
      search(data.query,data.limit,data.offset).then((res) => {
        // 注意：如果这里发生了异常，那么后面的this.checkMore是不会执行的，这个是关键！
        // 所以这里使用hasOwnProperty方法来判断对象是否有某属性，从而不会触发异常
        if (res.code === HTTP_OK && res.result.hasOwnProperty('songs')) {
          this._normalizeSongs(res.result.songs).then((resp) => {
            this.result = this.result.concat(resp);
          });          
        }
        this.checkMore(res.result);
      });
    },
    // 判断是否zhida然后给class
    getIconCls(item) {
      // if (item.type === TYPE_SINGER) {
      //   return "icon-mine";
      // } else {
      //   return "icon-music";
      // }
      return "icon-music";
    },
    // 处理text
    getDisplayName(item) {
      // if (item.type === TYPE_SINGER) {
      //   return item.singername;
      // } else {
      //   return `${item.name}-${item.singer}`;
      // }
      return item.name;
    },
    // 选择歌手或歌曲
    async selectItem(event, item) {
      event.stopPropagation();
      // if (item.type === TYPE_SINGER) {
      //   let singer = new Singer({
      //     id: item.singermid,
      //     name: item.singername,
      //   });
      //   this.$router.push({
      //     path: `/search/${singer.id}`,
      //   });
      //   this.setSinger(singer);
      // } else {
      //   this.insertSong(item);
      // }
      // 仅仅在选中歌曲时才发起ajax请求获取歌曲播放链接
      const songUrl = await getSong(item.mid);
      item.url = songUrl;      
      this.insertSong(item);
      this.$emit("select");
    },
    listScroll() {
      this.$emit("listScroll");
    },
    // // 出来返回的数据
    // async _genResult(data) {
    //   let ret = [];

    //   if (data.zhida && data.zhida.singerid) {
    //     ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
    //   }
    //   if (data.song) {
    //     let songs = await this._normalizeSongs(data.song.list);
    //     console.log(
    //       songs
    //     );
    //     ret = ret.concat(songs);
    //   }

    //   return ret;
    // },
    // 处理song数据
    _normalizeSongs(songs) {
      let ret = [];
      for (const song of songs) {
        const songItem = createSong(song);
        ret.push(songItem);
      }
      return Promise.resolve(ret);

      // const songPromise = new Promise(async (resolve) => {
      //   let ret = [];
      //   for (const song of songs) {
      //     const songItem = await createSong(song);
      //     ret.push(songItem);
      //   }
      //   resolve(ret);
      // });

      // const resultSongs = await songPromise;
      // return resultSongs;

      // return new Promise((resolve) => {
      //   let ret = [];
      //   list.forEach((musicData) => {
      //     if (musicData.songid && musicData.albummid) {
      //       createSong(musicData).then((song) => {
      //         // 过滤掉获取不到url地址的收费歌曲
      //         if (song.url.length > 50) {
      //           ret.push(song);

      //           // console.log(ret);
      //         }
      //       });
      //     }
      //   });
      //   //此处是数组ret值能正确返回出去的关键！！！！！
      //   setTimeout(() => {
      //     resolve(ret);
      //   }, 500);
      // });
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
    ...mapActions(["insertSong"]),
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
};
</script>
<style lang="stylus" scoped>
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.suggest {
  height: 100%;
  overflow: hidden;

  .suggest-list {
    padding: 0 30px;

    .suggest-item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
    }

    .icon {
      flex: 0 0 30px;
      width: 30px;

      [class^='icon-'] {
        font-size: 14px;
        color: $color-text-d;
      }
    }

    .name {
      flex: 1;
      font-size: $font-size-medium;
      color: $color-text-d;
      overflow: hidden;

      .text {
        no-wrap();
      }
    }
  }

  .no-result-wrapper {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>