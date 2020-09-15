<template>
  <div class="m-header">
      <div class="icon" :style="{backgroundImage:'url('+img+')'}"></div>
      <h1 class="text">YuanBest Music</h1>
      <router-link to="/user" class="mine" tag="div">
        <i class="icon-mine"></i>
      </router-link>
  </div>
</template>
<script>
export default{
  data() {
    return {
      img: require('./chart-icon.svg')
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'
.m-header
    position: relative
    height: 44px
    text-align center
    color: $color-theme
    font-size: 0
    .icon
        display inline-block
        vertical-align: top
        margin-top: 0px
        width: 44px
        height: 44px
        margin-right: 9px
        background-size: 50px 50px
        background-position center
    .text
        display: inline-block
        vertical-align: top
        line-height: 44px
        font-size: $font-size-large
    .mine
        position: absolute
        top: 0
        right: 0
        .icon-mine
            display: block
            padding: 12px
            font-size: 20px
            color: $color-theme
</style>