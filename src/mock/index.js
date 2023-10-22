const Mock = require('mockjs')
import axios from "axios"

const headers = {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}

const getSecuritySign = require("@/api/sign");

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



Mock.mock("/testmock", "get", (ctx) => { return "this is mock test" })
// 这里必须使用RegExp(url + ".*")来组合匹配请求的api地址，否则就会报404错误，因为MockJS默认不能识别带参数的请求。
Mock.mock(RegExp("/api/getSingerDetail" + ".*"), "get", (ctx) => {
    // console.log("mock get params==>", ctx.url.split('?')[1].split('=')[1])
    // return "this is mockjs route /getSingerDetail"

    const singerId = ctx.url.split('?')[1].split('=')[1]
    const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
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

    return new Promise((resolve, reject) => {
        axios.get(url, {
            // headers,
            params: Object.assign({}, commonParams, {
                sign,
                "-": randomKey,
                data,
            })
        }).then((res) => {
            console.log("mockjs res==>", res)
            resolve(res)
        }).catch((err) => reject(err))
    })


})

// 获取一个随机数值
function getRandomVal(prefix = "") {
    return prefix + (Math.random() + "").replace("0.", "");
}




