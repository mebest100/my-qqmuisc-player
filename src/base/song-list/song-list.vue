<template>
  <div class="song-list">
    <span v-if="showDeleteIcon" class="clear" @click="showConfirm">
      <i class="icon-clear"></i>
    </span>
    <div class="clear-float"></div>
    <!-- 清除浮动 -->
    <ul>
      <li
        @click="selectItem(song, index)"
        class="item"
        v-for="(song, index) in songs"
      >
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{ song.name }}</h2>
          <p class="desc">{{ getDesc(song) }}</p>
        </div>

        <span
          v-if="showDeleteIcon"
          @click.stop="delFromPlayHistory(index, song)"
          class="delete"
        >
          <i class="icon-delete"></i>
        </span>
      </li>
    </ul>

    <confirm
      ref="confirm1"
      @confirm="clearPlayHistory"
      text="是否清空所有播放历史"
      confirmBtnText="清空"
    ></confirm>

    <confirm
      ref="confirm2"
      @confirm="()=>{return}"
      text="播放历史为空，无法清空歌曲"
      confirmBtnText="确定"
    ></confirm>
  </div>
</template>

<script type="text/ecmascript-6">
import Confirm from "@/base/confirm/confirm";
import { mapActions, mapGetters } from "vuex";
export default {
  props: {
    songs: {
      type: Array,
      default: [],
    },
    rank: {
      type: Boolean,
      default: false,
    },
    showDeleteIcon: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters(["playHistory"]),
  },
  methods: {
    selectItem(item, index) {
      this.$emit("select", item, index);
    },
    getDesc(song) {
      return `${song.singer}·${song.album}`;
    },
    getRankCls(index) {
      if (index <= 2) {
        return `icon icon${index}`;
      } else {
        return "text";
      }
    },
    getRankText(index) {
      if (index > 2) {
        return index + 1;
      }
    },
    delFromPlayHistory(index, song) {
      this.$emit("del", index, song);
    },
    showConfirm() {
      if (this.playHistory.length == 0) {
        this.$refs.confirm2.show();
        return;
      }
      this.$refs.confirm1.show();
    },
    ...mapActions(["clearPlayHistory"]),
  },
  // 注意：confirm组件必须在components这里注册，
  // 否则不但confirm组件无法显示，还会导致全局组件内部元素无法显示也无法点击
  // 还会报错：this.$refs.confirm.show is not a function
  components: {
    Confirm,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';
@import '~common/stylus/mixin';

.song-list {
  .clear {
    float: right;
  }

  .clear-float {
    clear: both;
  }

  .item {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    height: 64px;
    font-size: $font-size-medium;

    .rank {
      flex: 0 0 25px;
      width: 25px;
      margin-right: 30px!important;
      text-align: center;

      .icon {
        display: inline-block;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;

        &.icon0 {
          bg-image('first');
        }

        &.icon1 {
          bg-image('second');
        }

        &.icon2 {
          bg-image('third');
        }
      }

      .text {
        color: $color-theme;
        font-size: $font-size-large;
      }
    }

    .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        no-wrap();
        color: $color-text;
      }

      .desc {
        no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }

    .delete {
      .icon-delete {
        color: $color-theme;
      }
    }
  }
}
</style>