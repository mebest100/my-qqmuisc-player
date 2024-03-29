import Vue from 'vue'
import Router from 'vue-router'
import DetailTest from 'components/detailTest/DetailTest.vue'
import Forecast from "components/detailTest/Forecast.vue";
import Analysis from "components/detailTest/Analysis.vue";

Vue.use(Router)

const Recommend = (resolve) => { // 按需加载组件
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}

const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
}

const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
}

const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}

const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}

const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}

const TopList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

export default new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      redirect: "/recommend",
    },
    {
      path: "/recommend",
      component: Recommend,
      children: [
        {
          path: ":id",
          component: Disc,
        },
      ],
    },
    {
      path: "/singer",
      component: Singer,
      children: [
        {
          path: ":id",
          component: SingerDetail,
        },
      ],
    },
    {
      path: "/rank",
      component: Rank,
      children: [
        {
          path: ":id",
          component: TopList,
        },
      ],
    },
    {
      path: "/search",
      component: Search,
      children: [
        {
          path: ":id",
          component: SingerDetail,
        },
      ],
    },
    {
      path: "/user",
      component: UserCenter,
    },
    {
      path: "/detailtest",
      name: 'DetailTest',
      component: DetailTest,
      redirect: "/detailtest/forecast",
      children: [
        {
          path: "/",
          redirect: "forecast",
        },
        {
          path: "forecast",
          component: Forecast,
          name: "Forecast",
        },
        {
          path: "analysis",
          component: Analysis,
          name: "Analysis",
        },
      ],
    },
  ],
});
