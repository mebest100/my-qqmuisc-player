const request = require('./util/request');
const cheerio = require('cheerio');
const Cache = require('./util/cache')
const uin = '956581739'

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

// 根据音乐mid获取歌曲播放地址
const RegisterGetSongUrl = (app) => {
    app.get('/api/getSong', (req, res) => {
        return new Promise( async (resolve, reject) => {
         try {
             const obj = { ...req.query, ...req.body };             
             const cache  = new Cache();
          
             const { id } = obj;
             const idArr = id.split(',');
             let count = 0;
             const idStr = idArr.map((id) => `"${id}"`).join(',');

             let cacheKey = `song_url_${idStr}`;
             let cacheData = cache.get(cacheKey)
             if (cacheData) {
                 return res.send(cacheData);
             }
             let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey2682247447678878&g_tk=5381&loginUin=${uin}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B"req_0"%3A%7B"module"%3A"vkey.GetVkeyServer"%2C"method"%3A"CgiGetVkey"%2C"param"%3A%7B"guid"%3A"2796982635"%2C"songmid"%3A%5B${idStr}%5D%2C"songtype"%3A%5B0%5D%2C"uin"%3A"${uin}"%2C"loginflag"%3A1%2C"platform"%3A"20"%7D%7D%2C"comm"%3A%7B"uin"%3A${uin}%2C"format"%3A"json"%2C"ct"%3A24%2C"cv"%3A0%7D%7D`
             let isOk = false;
             let result = null;

             const reqFun = async () => {
                 count += 1;
                 result = await request(url);
                 if (result.req_0.data.testfile2g) {
                     isOk = true;
                 }
             };

             while (!isOk && count < 10) {
                 await reqFun();
             }

             const domain = result.req_0.data.sip.find(i => !i.startsWith('http://ws')) || result.req_0.data.sip[0];
   

             const data = {};
             result.req_0.data.midurlinfo.forEach((item) => {
                 if (item.purl) {
                     data[item.songmid] = `${domain}${item.purl}`;
                 }
             });

             cacheData = {
                 data,
                 result: 100,
             }
             resolve(res.json(cacheData));
             cache.set(cacheKey, cacheData);
            
         } catch (error) {
             console.log("error==>", error)
             reject(error)
         }
       })

    })}

const routes = {
    RegisterGetBanner,
    RegisterGetRecomendDiscList,
    RegisterGetSongList,
    RegisterGetSongUrl
}

module.exports = routes