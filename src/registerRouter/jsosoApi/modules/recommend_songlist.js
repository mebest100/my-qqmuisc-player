const request = require('../util/request');

// 获取推荐歌单
module.exports = async (req, res) => {
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
            return res.send({ result });
        } else {
            const list = result.recomPlaylist.data.v_hot;
            return res.json({
                result: 100,
                data: {
                    list,
                    count: list.length,
                }
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