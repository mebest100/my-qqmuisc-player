const request = require('./util/request');
const cheerio = require('cheerio');

// 获取轮播图
const RegisterGetBanner = (app) => {
    app.get('/api/getBanner', async (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                req.query.ownCookie = 1;
                const page = await request('https://c.y.qq.com/node/musicmac/v6/index.html', {
                    dataType: 'raw',
                })
                const $ = cheerio.load(page);
                const result = [];
                $('.focus__box .focus__pic').each((a, b) => {
                    const domA = cheerio(b).find('a');
                    const domImg = cheerio(b).find('img');
                    const [type, id] = [domA.attr('data-type'), domA.attr('data-rid')];
                    const obj = {
                        type,
                        id,
                        picUrl: domImg.attr('src'),
                        h5Url: {
                            10002: `https://y.qq.com/musicmac/v6/album/detail.html?albumid=${id}`
                        }[type] || undefined,
                        typeStr: {
                            10002: 'album'
                        }[type] || undefined
                    }
                    result.push(obj);
                })

                return resolve(res.json({
                    result: 100,
                    data: result,
                }))


            } catch (error) {
                console.log("error=>", error)
                reject(error)
            }

        })

    })


}

// 获取推荐歌单
const RegisterGetRecomendDiscList = (app) => {
    app.get('/api/getRecomendDiscList', (req, res) => {

        return new Promise(async (resolve, reject) => {
            try {
                const { raw } = req.query;

                const data = {
                    data: JSON.stringify({
                        comm: {
                            ct: 24
                        },
                        recomPlaylist: {
                            method: "get_hot_recommend",
                            param: {
                                async: 1,
                                cmd: 2
                            },
                            module: "playlist.HotRecommendServer"
                        }
                    })
                };

                const result = await request({
                    url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
                    data,
                });

                if (Number(raw)) {
                    return resolve(res.send({ result }));
                } else {
                    const list = result.recomPlaylist.data.v_hot;
                    return resolve(res.json({
                        result: 100,
                        data: {
                            list,
                            count: list.length,
                        }
                    }))
                }

            } catch (error) {
                console.log("error==>", error)
                reject(error)
            }


        })

    });
}
// 根据id获取歌单详情
const RegisterGetSongList = (app) => {
    app.get('/api/getSongList', (req, res) => {

        new Promise(async (resolve, reject) => {
            try {
                const { id, raw } = req.query;
                if (!id) {
                    return resolve(res.json({
                        result: 500,
                        errMsg: 'id 不能为空',
                    }))
                }
                const result = await request({
                    url: 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
                    data: {
                        type: 1,
                        utf8: 1,
                        disstid: id, // 歌单的id
                        loginUin: 0,
                    },
                    headers: {
                        Referer: 'https://y.qq.com/n/yqq/playlist',
                    },
                });

                if (Number(raw)) {
                    resolve(res.json({ result }));
                } else {
                    resolve(res.json({
                        result: 100,
                        data: result.cdlist[0] || {},
                    }))
                }

            } catch (error) {
                console.log("error==>", error)
                reject(error)
            }
        })


    })
}

const routes = {
    RegisterGetBanner,
    RegisterGetRecomendDiscList,
    RegisterGetSongList
}

module.exports = routes