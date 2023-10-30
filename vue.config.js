const headers = {
  host: "i.y.qq.com",
  referer: "https://i.y.qq.com/n2/m/",
  "user-agent":
    "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  cookie:
    "_ga=GA1.2.1634646802.1582977621; pgv_pvid=9083335840; pgv_pvi=3690052608; RK=Z3YNFdUScP; ptcz=11c486385bcc91adb7a6bb89a2857ec7440fdca98508e4635ed1f8f2575865c2; tvfe_boss_uuid=cc3c60de5dd9367f; pt_sms_phone=189******60; pac_uid=0_af94bd847d197; XWINDEXGREY=0; ptui_loginuin=93303072; ts_refer=ADTAGmyqq; ts_uid=6622604064; psrf_qqunionid=; tmeLoginType=2; psrf_qqaccess_token=45ECC6265941E36B1D45BAC2B8CF9E2C; psrf_access_token_expiresAt=1606279281; psrf_qqrefresh_token=74AD21E9DE7CA9F3A4B71206265583F0; uin=1296538920; euin=oK-q7w4iNeEAon**; psrf_qqopenid=C9807D151EB8A2D399DB0A96EDBD574F; yq_index=0; userAction=1; yqq_stat=0; pgv_info=ssid=s1753859976; ts_last=y.qq.com/; pgv_si=s237346816",
};

const RegisterRoute = require("./src/registerRouter");

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",

  productionSourceMap: false, // 禁止生产打包source map文件

  devServer: {
    progress: false, // 禁止启动时显示编译日志
    before: (app) => RegisterRoute(app),
    port: 8082,
    // proxy: {
      //   // "/api/getBanner": {
      //   //   target: "http://127.0.0.1:3300/recommend/banner",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getBanner": "",
      //   //   },
      //   // },

      //   // "/api/getRecomendDiscList": {
      //   //   target: "http://127.0.0.1:3300/recommend/playlist/u",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getRecomendDiscList": "",
      //   //   },
      //   // },

      //   // "/api/getSongList": {
      //   //   target: "http://127.0.0.1:3300/songlist",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getSongList": "",
      //   //   },
      //   // },

      //   // "/api/getSongNetEase": {
      //   //   //vue.config.js中路由匹配是从上到下的，所以api/getSongNetEase必须放在api/getSong的前面，否则会出现404错误
      //   //   //因为一旦匹配到了api/getSong了，后面的路由规则就不会继续匹配了
      //   //   target: "http://127.0.0.1:3900",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getSongNetEase": "/song/url",
      //   //   },
      //   // },

      //      // "/api/getNetEaseLyric": { // 获取网易音乐接口歌词
      //   //   target: "http://127.0.0.1:3900",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getNetEaseLyric": "/lyric",
      //   //   },
      //   // },

      //        // "/api/NetEaseSearch": {
      //   //   target: "http://127.0.0.1:3900",
      //   //   // target: "https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp",
      //   //   changeOrigin: true, //允许跨域,
      //   //   // headers: headers,
      //   //   pathRewrite: {
      //   //     "^/api/NetEaseSearch": "/search",
      //   //   },
      //   // },

      //   // "/api/getSong": {
      //   //   target: "http://127.0.0.1:3300/song/urls",
      //   //   changeOrigin: true, //允许跨域,
      //   //   pathRewrite: {
      //   //     "^/api/getSong": "",
      //   //   },
      //   // },

      // "/api/getQQlyric": {
      //   // 获取qq音乐接口歌词
      //   target: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
      //   changeOrigin: true, //允许跨域,
      //   headers: {
      //     // 注意必须要有headers，否则获取不到歌词数据
      //     referer: "https://c.y.qq.com/",
      //     host: "c.y.qq.com",
      //   },
      //   pathRewrite: {
      //     "/api/getQQlyric": "", // 这里pathRewrite不能写错，否则会报404错误
      //   },
      // },

      // "/api/getSingerDetail": {
      //   target: "https://u.y.qq.com/cgi-bin/musics.fcg",
      //   // target: "http://127.0.0.1:3800",
      //   changeOrigin: true, //允许跨域,
      //   headers: {
      //     referer: "https://c.y.qq.com/",
      //     host: "c.y.qq.com",
      //     origin: "https://y.qq.com/",
      //     "user-agent":
      //       "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
      //   },
      //   // 使用3800代理就不能启用pathRewrite，否则会产生404错误
      //   pathRewrite: {
      //     "^/api/getSingerDetail": "",
      //   },
      // },
    
    // },

  },
  configureWebpack: {
    resolve: {
      extensions: [".js", ".css", ".vue"],
      alias: {
        assets: "@/assets",
        static: "@/static",
        components: "@/components",
        base: "@/base",
        api: "@/api",
        common: "@/common",
      },
    },
  },
};
