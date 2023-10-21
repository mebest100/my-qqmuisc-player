import jsonp from "common/js/jsonp";
import { commonParams, options } from "./config";
const getSecuritySign = require("./sign");
import axios from "axios";
import { ERR_OK } from "api/config";

export function getSingerList() {
  const url = "https://c.y.qq.com/v8/fcg-bin/v8.fcg";

  const data = Object.assign({}, commonParams, {
    channel: "singer",
    page: "list",
    key: "all_all_all",
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: "yqq",
  });
  let resp = jsonp(url, data, options);
  console.log("json-singerlist----------------------------------");
  return resp;
}

// export function getSingerDetail(singerId) {
//   const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'

//   const data = Object.assign({}, commonParams, {
//     hostUin: 0,
//     needNewCode: 0,
//     platform: 'yqq',
//     order: 'listen',
//     begin: 0,
//     num: 80,
//     songstatus: 1,
//     singermid: singerId
//   })

//   return jsonp(url, data, options)
// }

export function getSingerDetail2(singerId) {
  

  const url = "/api/getSingerDetail";

  return axios
    .get(url, {
      params: { id: singerId },
    })
    .then((response) => {
      console.log(response.data);
      let result = {};
      const data = response.data;
      if (data.code === ERR_OK) {
        const list = data.singerSongList.data.songList;
        // 歌单详情、榜单详情接口都有类似处理逻辑，固封装成函数
        const songList = handleSongList(list);

        result = {
          code: ERR_OK,
          result: {
            songs: songList,
          },
        };
      } else {
        result = data;
      }

      console.log("result ==>", result)
     return Promise.resolve(result); // 注意这里必须有return，否则对方使用回调函数时就会取不到值：报undefined错误
    });
}

// 获取一个随机数值
function getRandomVal(prefix = "") {
  return prefix + (Math.random() + "").replace("0.", "");
}

// 处理歌曲列表
function handleSongList(list) {
  const songList = [];

  list.forEach((item) => {
    const info = item.songInfo || item;
    if (info.pay.pay_play !== 0 || !info.interval) {
      // 过滤付费歌曲和获取不到时长的歌曲
      return;
    }

    // 构造歌曲的数据结构
    const song = {
      id: info.id,
      mid: info.mid,
      name: info.name,
      singer: mergeSinger(info.singer),
      url: "", // 在另一个接口获取
      duration: info.interval,
      image: info.album.mid
        ? `https://y.gtimg.cn/music/photo_new/T002R800x800M000${info.album.mid}.jpg?max_age=2592000`
        : fallbackPicUrl,
      album: info.album.name,
    };

    songList.push(song);
  });

  return songList;
}

// 合并多个歌手的姓名
function mergeSinger(singer) {
  const ret = [];
  if (!singer) {
    return "";
  }
  singer.forEach((s) => {
    ret.push(s.name);
  });
  return ret.join("/");
}
