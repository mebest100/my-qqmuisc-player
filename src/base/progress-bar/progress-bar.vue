<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div
      class="bar-inner"
      @touchstart.prevent="progressTouchStart"
      @touchmove.prevent="progressTouchMove"
      @touchend="progressTouchEnd"
    >
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
const progressBtnWidth = 16;

export default {
  props: {
    percent: {
      type: Number,
      default: 0,
    },
  },
  created () {
    this.touch={}
  },
  methods: {
    progressTouchStart(e) {
      this.touch.initiated = true;
    },
    progressTouchMove(e) {
      if (!this.touch.initiated) {
        return;
      }
      const btnOffset =
        e.touches[0].pageX -
        this.checkOffset(this.$refs.progressBar, "offsetLeft");
      const offsetWidth = Math.min(
        this.$refs.progressBar.clientWidth - progressBtnWidth,
        Math.max(0, btnOffset)
      );
      this.setNewOffset(offsetWidth);
    },
    progressTouchEnd() {
      this.touch.initiated = false;
      this._triggerPercent();
    },
    progressClick(e) {
      const rect = this.$refs.progressBar.getBoundingClientRect();
      const offsetWidth = e.pageX - rect.left;
      this.setNewOffset(offsetWidth);
      // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
      // this.setNewOffset(e.offsetX)
      this._triggerPercent();
    },
    _triggerPercent() {
      const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
      const percent = this.$refs.progress.clientWidth / barWidth;
      this.$emit("percentChange", percent);
    },
    setNewOffset(offsetWidth) {
      this.$refs.progress.style.width = `${offsetWidth}px`;
      this.$refs.progressBtn.style.left = `${offsetWidth - 8}px`;
    },
    checkOffset(element, offsetType) {
      let curOffset = element[offsetType];
      while ((element = element.offsetParent)) {
        curOffset += element[offsetType];
      }

      return curOffset;
    },
  },
  watch: {
    percent(newPercent) {
      //拖动未结束之前，不得修改播放进度条和播放按钮的最终状态。
      if (newPercent >= 0 && !this.touch.initiated) {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth;
        const offsetWidth = newPercent * barWidth;
        this.setNewOffset(offsetWidth);
      }
    },
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable';

.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);

    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }

    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;

      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>