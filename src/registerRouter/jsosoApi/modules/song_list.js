const request = require('../util/request');

// 根据id获取歌单详情
module.exports = async (req, res) => {
    try {
        const { id, raw } = req.query;
        if (!id) {
            return res.json({
                result: 500,
                errMsg: 'id 不能为空',
            })
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
            return res.json({ result });
        } else {
            return res.json({
                result: 100,
                data: result.cdlist[0] || {},
            })
        }

    } catch (error) {
        console.log("error=>", error)
        return res.status(500).send({
            code: 500,
            data: null,
            err: error,
        })
    }
}