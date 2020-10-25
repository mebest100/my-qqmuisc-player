<template>
  <scroll
    ref="suggest"
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from "base/scroll/scroll";
import Loading from "base/loading/loading";
import NoResult from "base/no-result/no-result";
import { search } from "api/search";
import { ERR_OK } from "api/config";
import { createSong } from "common/js/song";
import { mapMutations, mapActions } from "vuex";
import Singer from "common/js/singer";

const TYPE_SINGER = "singer"; //这个TYPE_Singer的值可以随便写
const perpage = 20;

export default {
  props: {
    showSinger: {
      type: Boolean,
      default: true,
    },
    query: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      page: 1,
      pullup: true,
      beforeScroll: true,
      hasMore: true,
      result: [],
    };
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh();
    },
    search() {
      this.page = 1;
      this.hasMore = true;
      this.$refs.suggest.scrollTo(0, 0);
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        console.log(res);
        if (res.code === ERR_OK) {
          // console.log("searchresult---------------------------------");
          // console.log(res);
          this._genResult(res.data).then((resp) => {
            this.result = this.result.concat(resp);
          });
          this._checkMore(res.data);
        }
      });
    },
    searchMore() {
      if (!this.hasMore) {
        return;
      }
      this.page++;
      search(this.query, this.page, this.showSinger, perpage).then((res) => {
        if (res.code === ERR_OK) {
          this._genResult(res.data).then((resp) => {
            this.result = this.result.concat(resp);
          });
          this._checkMore(res.data);
        }
      });
    },
    listScroll() {
      this.$emit("listScroll");
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        const singer = new Singer({
          id: item.singermid,
          name: item.singername,
        });
        this.$router.push({
          path: `/search/${singer.id}`,
        });
        this.setSinger(singer);
      } else {
        console.log("selected songmid is:" + item.mid);
        //这里的insertSong源自于mapActions。
        this.insertSong(item);
      }
      this.$emit("select", item);
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername;
      } else {
        return `${item.name}-${item.singer}`;
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return "icon-mine";
      } else {
        return "icon-music";
      }
    },
    async _genResult(data) {
      let ret = [];
      // 注意搜索歌手才有zhida选项，搜索歌曲则没有
      if (data.zhida && data.zhida.singerid) {
        // console.log(data);
        ret.push({ ...data.zhida, ...{ type: TYPE_SINGER } });
        // console.log(ret);
      }
      if (data.song) {
        let songs = await this._normalizeSongs(data.song.list);
        console.log(songs);
        ret = ret.concat(songs);
        // console.log(ret);
      }

      return ret;
    },
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
        setTimeout(() => {
          resolve(ret);
        }, 500);
      });
    },
    _checkMore(data) {
      const song = data.song;
      if (
        !song.list.length ||
        song.curnum + song.curpage * perpage > song.totalnum
      ) {
        this.hasMore = false;
      }
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
    ...mapActions(["insertSong"]),
  },
  watch: {
    query(newval) {
      this.search(newval);
      //重置旧的搜索结果，重要！！！！
      this.result = [];
    },
  },
  components: {
    Scroll,
    Loading,
    NoResult,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
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
