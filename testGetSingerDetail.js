const  axios = require("axios")

const headers = {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}

const getSecuritySign = require("./src/api/sign");

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

const url = "https://u.y.qq.com/cgi-bin/musics.fcg";

const singerId = '002J4UUk29y8BY'
const data = JSON.stringify({
    comm: { ct: 24, cv: 0 },
    singerSongList: {
        method: "GetSingerSongList",
        param: { order: 1, singerMid: singerId, begin: 0, num: 100 },
        module: "musichall.song_list_server",
    },
});

const randomKey = getRandomVal("getSingerSong");
const sign = getSecuritySign(data);

axios.get(url, {
        headers,
        params: Object.assign({}, commonParams, {
            sign,
            "-": randomKey,
            data,
        }),
    }).then(res => {
        console.log("res=>",res.data)
        console.log("songList=>", res.data.singerSongList.data.songList)
    })

// 获取一个随机数值
function getRandomVal(prefix = "") {
    return prefix + (Math.random() + "").replace("0.", "");
}