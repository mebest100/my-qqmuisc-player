const express = require('express')
const axios = require('axios')
const app = express()
const apiRouter = express.Router()
const history = require("connect-history-api-fallback");

//运行之前：一定要先npm build编译，否则会出现莫名其妙的一些错误。
const headers = {
    host: 'i.y.qq.com',
    referer: 'https://i.y.qq.com/n2/m/',
    'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1',
    cookie: '_ga=GA1.2.1634646802.1582977621; pgv_pvid=9083335840; pgv_pvi=3690052608; RK=Z3YNFdUScP; ptcz=11c486385bcc91adb7a6bb89a2857ec7440fdca98508e4635ed1f8f2575865c2; tvfe_boss_uuid=cc3c60de5dd9367f; pt_sms_phone=189******60; pac_uid=0_af94bd847d197; XWINDEXGREY=0; ptui_loginuin=93303072; ts_refer=ADTAGmyqq; ts_uid=6622604064; psrf_qqunionid=; tmeLoginType=2; psrf_qqaccess_token=45ECC6265941E36B1D45BAC2B8CF9E2C; psrf_access_token_expiresAt=1606279281; psrf_qqrefresh_token=74AD21E9DE7CA9F3A4B71206265583F0; uin=1296538920; euin=oK-q7w4iNeEAon**; psrf_qqopenid=C9807D151EB8A2D399DB0A96EDBD574F; yq_index=0; userAction=1; yqq_stat=0; pgv_info=ssid=s1753859976; ts_last=y.qq.com/; pgv_si=s237346816'
}


apiRouter.get('/search', function (req, res) {
    var url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
    axios.get(url, {
        headers: headers,
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})


apiRouter.get('/getRecommend', function (req, res) {
    var url = 'http://127.0.0.1:3300/recommend/banner'
    axios.get(url, {
        headers: headers,
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

apiRouter.get('/getDisclist', function (req, res) {
    var url = 'http://127.0.0.1:3300/recommend/playlist/u'
    axios.get(url, {
        headers: headers,
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

apiRouter.get('/getSonglist', function (req, res) {
    var url = 'http://127.0.0.1:3300/songlist'
    axios.get(url, {
        headers: headers,
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

apiRouter.get('/getSong', function (req, res) {
    var url = "http://127.0.0.1:3300/song/urls";
    // var url = 'https://api.zsfmyz.top/music/song'
    axios.get(url, {
        params: req.query
    }).then((response) => {
        res.json(response.data)
    }).catch((e) => {
        console.log(e)
    })
})

apiRouter.get('/lyric', function (req, res) {
    var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    axios.get(url, {
        headers: {
            referer: 'https://c.y.qq.com/',
            host: 'c.y.qq.com'
        },
        params: req.query
    }).then((response) => {
        var ret = response.data
        if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
                ret = JSON.parse(matches[1])
            }
        }
        res.json(ret)
    }).catch((e) => {
        console.log(e)
    })
})

app.use(history())
app.use('/api', apiRouter)
app.use(express.static('./dist'))

const port = 9000

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

            if( newport !== port) {
                console.log(`预定端口${port}被占用！`);
            }
            console.log(`分配新端口${newport}，Listening on http://localhost:${newport}\n`);
        });
    });
})();