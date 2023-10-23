const request = require('./util/request');
const cheerio = require('cheerio');


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

const RegisterGetRecomendDiscList = (app) => {
    app.get('/api/getRecomendDiscList', async (req, res) => {
        const {
            raw,
            pageNo = 1,
            pageSize = 20,
            id = 3317, // 3317: 官方歌单，59：经典，71：情歌，3056：网络歌曲，64：KTV热歌
        } = req.query;

        const data = {
            data: JSON.stringify({
                comm: {
                    ct: 24
                },
                playlist: {
                    method: "get_playlist_by_category",
                    param: {
                        id: id / 1,
                        curPage: pageNo / 1,
                        size: pageSize / 1,
                        order: 5,
                        titleid: id / 1,
                    },
                    module: "playlist.PlayListPlazaServer"
                }
            }),
        };

        return new Promise(async (resolve, reject) => {
            try {
                const result = await request({
                    url: 'http://u.y.qq.com/cgi-bin/musicu.fcg',
                    data,
                });

                if (Number(raw)) {
                    return resolve(res.json({ result }));
                } else {
                    const { total, v_playlist } = result.playlist.data;
                    return resolve(res.json({
                        result: 100,
                        data: {
                            total,
                            list: v_playlist,
                            id,
                            pageNo,
                            pageSize,
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

const routes = {
    RegisterGetBanner,
    RegisterGetRecomendDiscList
}

module.exports = routes