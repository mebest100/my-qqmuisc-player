// 歌曲链接
module.exports = async (query, request) => {
  query.cookie.os = "pc";
  const ids = query.id.split(",");
  const data = {
    ids: JSON.stringify(ids),
    br: parseInt(query.br || 999000),
  };

  const res = await request(
    "POST",
    `https://interface3.music.163.com/eapi/song/enhance/player/url`,
    data,
    {
      crypto: "eapi",
      cookie: query.cookie,
      // proxy: query.proxy,
      // realIP: query.realIP,
      url: "/api/song/enhance/player/url",
    }
  );

  if (res.body.code != 200 ) {
    throw new Error(JSON.stringify(res.body))  // 注意这里new Error的参数不能是对象，而必须是字符串！！！
  }
  // 根据id排序
  const result = res.body.data;
  console.log("get Song url res==>",res)
  result.sort((a, b) => {
    return ids.indexOf(String(a.id)) - ids.indexOf(String(b.id));
  });
  return {
    status: 200,
    body: {
      code: 200,
      data: result,
    },
  };

};
