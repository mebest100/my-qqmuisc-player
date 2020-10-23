<template>
  <div class="detail-wrap">
    <div class="detail-left">
      <ul>
        <li><router-link :to="{ name: 'Forecast' }">预测</router-link></li>
        <li><router-link :to="{ name: 'Analysis' }">分析</router-link></li>

        <!-- <li><router-link to="/detailtest/forecast">预测</router-link></li>
        <li><router-link to="/detailtest/analysis">分析</router-link></li> -->

      </ul>
    </div>

    <div class="detail-right">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
<style  scoped>
ul, li {
  list-style-type: none;
}

.detail-wrap {
  width: 1200px;
  margin: 0 auto;
  overflow: hidden;
  padding-top: 20px;
}

.detail-left {
  float: left;
  width: 200px;
  text-align: center;
}

.detail-right {
  float: left;
  width: 980px;
  margin-left: 20px;
  transform: translateX(-90px)
}
</style>