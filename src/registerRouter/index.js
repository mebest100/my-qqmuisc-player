const { RegisterQQMusicApi } = require("./jsosoApi");
const { RegisterNetEaseMusicApi } = require("./NetEaseApi");

const headers = {
  referer: "https://y.qq.com/",
  origin: "https://y.qq.com/",
  "user-agent":
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36",
};
const getSecuritySign = require("../api/sign");

const commonParams = {
  g_tk: 5381,
  loginUin: 0,
  hostUin: 0,
  inCharset: "utf8",
  outCharset: "utf-8",
  notice: 0,
  needNewCode: 0,
  format: "json",
  platform: "yqq.json",
};

const getRandomVal = (prefix = "") => {
  return prefix + (Math.random() + "").replace("0.", "");
};

const axios = require("axios");

const RegisterTestApp = (app) => {
  app.get("/testapp", (req, res) => {
    console.log("request param,", req.query.id);
    res.json({ msg: "worked" });
  });
};

const RegisterSingerDetail = (app) => {
  app.get("/api/getSingerDetail", (req, res) => {
    console.log("getSingerDetail request param,", req.query.id);
    // return res.json({ "/api/getSingerDetail": "worked" })
    const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
    const data = JSON.stringify({
      comm: { ct: 24, cv: 0 },
      singerSongList: {
        method: "GetSingerSongList",
        // singerMid是根据歌手id获取歌手专辑详情
        param: { order: 1, singerMid: req.query.id, begin: 0, num: 100 },
        module: "musichall.song_list_server",
      },
    });
    const randomKey = getRandomVal("getSingerSong");
    const sign = getSecuritySign(data);
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers,
          params: Object.assign({}, commonParams, {
            sign,
            "-": randomKey,
            data,
          }),
        })
        .then((response) => {
          return resolve(res.json(response.data));
        })
        .catch((err) => {
          console.log(err);
          return reject(err);
        });
    });
  });
};

// 获取歌词
const RegisterGetQQLyric = (app) => {
  app.get("/api/getQQlyric", (req, res) => {    
    let url = "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg";
    let data = Object.assign({}, commonParams, {
      // 注意：请求参数中是否有mid字段，而且能否根据这个字段获取到歌曲mid，否则歌词也获取不到
      songmid: req.query.mid,
      pcachetime: +new Date(),
      platform: "yqq",
      hostUin: 0,
      needNewCode: 0,
      format: "json",
    });
    console.log("songmid for lyric is ==>", req.query.mid);
    return new Promise((resolve, reject) => {
      axios
        .get(url, {
          headers: headers, // 注意必须要有headers，否则获取不到歌词数据
          params: data,
        })
        .then((response) => {
          console.log("RegisterGetQQLyric response=>", response);
          return resolve(res.json(response.data));
        });
    });
  });
};

const RegisterRoute = (app) => {
  RegisterTestApp(app);
  RegisterSingerDetail(app);
  RegisterGetQQLyric(app);
  RegisterQQMusicApi(app);
  RegisterNetEaseMusicApi(app);
};

module.exports = RegisterRoute;
