<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getSingerDetail2 } from "api/singer";
import { ERR_OK } from "api/config";
import { createSongList } from "common/js/song3";
import { mapGetters } from "vuex";

export default {
  computed: {
    title() {
      return this.singer.name;
    },
    bgImage() {
      return this.singer.avatar;
    },
    ...mapGetters(["singer"]),
  },
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getDetail();
    console.log(this.singer);
  },
  methods: {
    _getDetail() {
      if (!this.singer.id) {
        this.$router.push("/singer");
        return;
      }
      getSingerDetail2(this.singer.id).then((res) => { // 根据歌手id获取歌手专辑详情
        console.log("getSingerDetail2 res==>", res);
        if (res.code === ERR_OK) {
          // this.songs = res.result.songs
          this._normalizeSongs(res.result.songs).then(
            (resultSongs) => {
              this.songs = resultSongs;
            }
          );
        }
      });
    },
    _normalizeSongs(songlist) {
      // let ret = []
      // list.forEach((item) => {
      //   if (item.mid && item.album) {
      //     createSong(item).then(res => {
      //        ret.push(res)
      //     })
      //   }
      // })
      // return ret
      return createSongList(songlist);
    },
  },
  components: {
    MusicList,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s;
}

.slide-enter, .slide-leave-to {
  transform: translate3d(100%, 0, 0);
}
</style>