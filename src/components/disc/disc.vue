<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from "components/music-list/music-list";
import { getSongList } from "api/recommend";
import { mapGetters } from "vuex";
import { createSongList, createSong } from "common/js/song";


export default {
  computed: {
    title() {
      return this.disc.title;
    },
    bgImage() {
      return this.disc.cover;
    },
    ...mapGetters(["disc"]),
  },
  data() {
    return {
      songs: [],
    };
  },
  created() {
    this._getSongList();
  },
  methods: {
    _getSongList() {
      if (!this.disc.content_id) {
        this.$router.push("/recommend");
        return;
      }
      getSongList(this.disc.content_id).then((res) => {
        if (res.result === 100) {
          this._normalizeSongs(res.data.songlist).then(
            (resultSongs) => {
              this.songs = resultSongs;
            }
          );
        }
      });
    },
    _normalizeSongs(songlist) {
      // let ret = []
      // // musicData是每一首歌的信息
      // list.forEach((musicData) => {
      //   if (musicData.songid && musicData.albummid) {
      //   createSong(musicData).then(res => {
      //       // 收费歌曲获取不到url过滤
      //       // if (res.url.length > 50) {
      //       //    ret.push(res)
      //       // }
      //       ret.push(res)
      //     })
      //   }
      // })
      // return ret
      return createSongList(songlist)
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