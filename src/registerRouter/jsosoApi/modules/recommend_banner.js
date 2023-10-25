const request = require('../util/request');
const cheerio = require('cheerio');

// 获取轮播图
module.exports = async (req, res) => {
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

        return res.json({
            result: 100,
            data: result,
        })


    } catch (error) {
        console.log("error=>", error)
        return res.status(500).send({
            code: 500,
            data: null,
            err: error,
        })
    }

}