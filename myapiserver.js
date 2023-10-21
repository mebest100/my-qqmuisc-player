const express = require('express')
const axios = require('axios')
const app = express()

// const history = require("connect-history-api-fallback");


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


app.get('/api/getSingerDetail', function (req, res) {
    console.log("getSingerDetail服务端路由匹配到了！")
    console.log("请求参数是==》", req.query)

   
    const data = JSON.stringify({
        comm: { ct: 24, cv: 0 },
        singerSongList: {
            method: "GetSingerSongList",
            param: { order: 1, singerMid: req.query.id, begin: 0, num: 100 },
            module: "musichall.song_list_server",
        },
    });

    const randomKey = getRandomVal("getSingerSong");
    const sign = getSecuritySign(data);

    const url = 'https://u.y.qq.com/cgi-bin/musics.fcg'
    axios.get(url, {
        headers,
        params: Object.assign({}, commonParams, {
            sign,
            "-": randomKey,
            data,
        })
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})


// 获取一个随机数值
function getRandomVal(prefix = "") {
    return prefix + (Math.random() + "").replace("0.", "");
}


// app.use(history())



const port = 3800

const portfinder = require("portfinder");
module.exports = (() => {
    portfinder.basePort = port
    portfinder.getPort((err, newport) => {
        if (err) {
            return;
        }

        app.listen(newport, error => {
            if (error) {
                console.log(error);
                return;
            }

            if (newport !== port) {
                console.log(`预定端口${port}被占用！`);
                console.log(`分配新端口${newport}，Listening on http://localhost:${newport}\n`);
            }
            console.log(`${newport}端口可用，Listening on http://localhost:${newport}\n`);

        });
    });
})();