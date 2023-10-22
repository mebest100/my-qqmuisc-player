const headers = {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}
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
}

const axios = require("axios")

const RegisterTestApp = (app) => {
    app.get("/testapp", (req, res) => {
        console.log("request param,", req.query.id)
        res.json({ msg: "worked" })
    })
}

const RegisterSingerDetail = (app) => {
    app.get("/api/getSingerDetail", (req, res) => {
        console.log("getSingerDetail request param,", req.query.id)
        // return res.json({ "/api/getSingerDetail": "worked" })
        const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
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
        return new Promise((resolve, reject) => {
            axios.get(url, {
                headers: headers,
                params: Object.assign({}, commonParams, {
                    sign,
                    "-": randomKey,
                    data,
                })
            }).then((response) => {
                return resolve(res.json(response.data))
            }).catch((err) => {
                console.log(err)
                return reject(err)
            })

        })
    })
}

const RegisterRoute = (app) => {
    RegisterTestApp(app)
    RegisterSingerDetail(app)
}



module.exports = RegisterRoute