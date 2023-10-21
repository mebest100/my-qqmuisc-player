<template>
  <!-- @touchmove.prevent  -->
  <div id="app" @touchmove.prevent>
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <player></player>
  </div>
</template>

<script type="text/ecmascript-6">
import MHeader from "components/m-header/m-header";
import Player from "components/player/player";
import Tab from "components/tab/tab";
import axios from "axios";

export default {
  created() {
    // console.log("Vue App created")
   
  },
  components: {
    MHeader,
    Tab,
    Player,
  },
};
</script>

<style scoped lang="stylus" rel="stylesheet/stylus"></style>