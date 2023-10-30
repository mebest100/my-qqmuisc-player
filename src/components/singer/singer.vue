<template>
  <div class="singer" ref="singer">
    <!-- singers是经过排序后的歌手列表：热门歌手在最前，后面的是排序后的字母歌手 -->
    <list-view @select="selectSinger" :singers="singers" ref="list"></list-view>
    <router-view></router-view>
  </div>
</template>

<script>
import ListView from "base/listview/listview";
import { getSingerList } from "api/singer";
import { ERR_OK } from "api/config";
import Singer from "common/js/singer";
import { mapMutations } from "vuex";
import { playListMixin } from "common/js/mixin";

const HOT_SINGER_LEN = 10;
const HOT_NAME = "热门";

export default {
  mixins: [playListMixin],
  data() {
    return {
      singers: [],
    };
  },
  created() {
    this._getSingerList();
  },
  methods: {
    handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? "60px" : "";
      this.$refs.singer.style.bottom = bottom;
      this.$refs.list.refresh();
    },
    selectSinger(singer) {
      this.$router.push({
        // 跳转SingerDetail组件
        path: `/singer/${singer.id}`,
      });
      this.setSinger(singer);
    },
    _getSingerList() {
      getSingerList().then((res) => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list);
        }
      });
    },
    _normalizeSinger(list) {
      let map = {
        // map分为热门歌手和非热门歌手
        // 热门歌手的title: 热门； 非热门歌手的title: 歌手姓名的首字母
        hot: {
          title: HOT_NAME,
          items: [],
        },
      };
      list.forEach((item, index) => {
        // 把歌手列表的前十位放进热门歌手hot的清单
        if (index < HOT_SINGER_LEN) {
          map.hot.items.push(
            new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid,
            })
          );
        }
        // 对于非热门歌手：把歌手的首字母作为key
        // key的值是{title:歌手首字母，items: 歌手首字母相同的歌手信息集合}
        const key = item.Findex; // Findex是歌手姓名的首字母
        if (!map[key]) {
          map[key] = {
            title: key,
            items: [],
          };
        }
        // 把歌手首字母相同的歌手信息归到同一组，数据放到items里面
        map[key].items.push(
          new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid,
          })
        );
      });
      // 以上把歌手信息处理完毕
      // 把歌手列表按照热门歌手和非热门歌手分为两组
      // 然后对非热门歌手按照字母进行排序
      let notHot = [];
      let hot = [];
      for (let key in map) {
        let val = map[key];
        if (val.title.match(/[a-zA-Z]/)) {
          notHot.push(val);
        } else if (val.title === HOT_NAME) {
          hot.push(val);
        }
      }
      // charCodeAt(0)表示获取字符串的第一个字符的 Unicode 编码值。
      // 这里是把Unicode 编码值较大的字符串排到后面
      // sort接收一个排序函数作为参数，根据排序函数的返回结果进行排序
      // 排序函数的两个参数:a和b，分别代表了被排序数组的两个元素
      // sort的排序函数虽然只接收两个参数:a和b, 但是实际上是需要遍历整个数组，
      // 它使用一种常见的排序算法，通常是快速排序或合并排序的变种，来对数组进行有效的排序
      // 通过多次调用比较函数来确定元素的相对顺序
      
      notHot.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0);
      });
      return hot.concat(notHot);
    },
    ...mapMutations({
      setSinger: "SET_SINGER",
    }),
  },
  components: {
    ListView,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
