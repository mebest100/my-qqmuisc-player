const request = require('../util/request');
const Cache = require('../util/cache')

// 根据音乐mid获取歌曲播放地址
module.exports = async (req, res) => {
    const uin = '956581739'
    try {
        const obj = { ...req.query, ...req.body };
        const cache = new Cache();

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
      
        cache.set(cacheKey, cacheData);
        return res.json(cacheData)

    } catch (error) {
        console.log("error=>", error)
        return res.status(500).send({
            code: 500,
            data: null,
            err: error,
        })
    }

}