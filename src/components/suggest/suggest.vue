<template>
  <scroll
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    :beforeScroll="beforeScroll"
    :pullup="pullup"
    :data="result"
    class="suggest"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        @click="selectItem(item)"
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
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import Singer from "common/js/singer";
import { mapMutations, mapActions } from "vuex";
// 组件
import Scroll from "base/scroll/scroll";
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
      perpage: 20, // 每页的条数
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
      search(this.query, this.page, this.showSinger, this.perpage).then(
        (res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((resp) => {
              this.result = this.result.concat(resp);
            });

            this.checkMore(res.data);
          }
        }
      );
    },
    // 判断是否已经加载完
    checkMore(data) {
      let song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * 20 > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    // 搜索的加载更多
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, this.perpage).then(
        (res) => {
          if (res.code === ERR_OK) {
            this._genResult(res.data).then((resp) => {
              this.result = this.result.concat(resp);
            });
            this.checkMore(res.data);
          }
        }
      );
    },
    // 判断是否zhida然后给class
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    // 处理text
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    // 选择歌手或歌曲
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        let singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        this.setSinger(singer);
      } else {
        this.insertSong(item);
      }
      this.$emit("select");
    },
    listScroll() {
      this.$emit("listScroll");
    },
    // 出来返回的数据
    async _genResult(data) {
      let ret = [];

      if (data.zhida && data.zhida.singerid) {
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
      }
      if (data.song) {
        let songs = await this._normalizeSongs(data.song.list);
        console.log(
          songs
        );
        ret = ret.concat(songs);
      }

      return ret;
    },
    // 处理song数据
    _normalizeSongs(list) {
      return new Promise((resolve) => {
        let ret = [];
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            createSong(musicData).then((song) => {
              // 过滤掉获取不到url地址的收费歌曲
              if (song.url.length > 50) {
                ret.push(song);

                // console.log(ret);
              }
            });
          }
        });
        //此处是数组ret值能正确返回出去的关键！！！！！
        setTimeout(() => {
          resolve(ret);
        }, 500);
      });
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