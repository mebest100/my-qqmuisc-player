import jsonp from 'common/js/jsonp'
import { commonParams, options } from './config'
import axios from 'axios'

// 热门关键字
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const data = Object.assign({}, commonParams, {
    platfrom: 'h5',
    needNewCode: 1
  })
  return jsonp(url, data, options)
}

// 搜索歌曲

export function search(query,limit=20) {
  const url = '/api/search'

   const data = {keywords: query,limit};

  // const data = Object.assign({}, commonParams, {
  //   w: query,
  //   p: page,
  //   perpage: perpage,
  //   n: perpage,
  //   _: 1599102016772,
  //   g_tk: 5381,
  //   uin: 1296538920,
  //   platform: 'h5',
  //   needNewCode: 1,
  //   g_tk_new_20200303: 5381,
  //   zhidaqu: 1,
  //   catZhida: zhida ? 1 : 0,
  //   t: 0,
  //   flag: 1,
  //   sem: 1,
  //   aggr: 0,
  //   remoteplace: 'txt.mqq.all',
  //   inCharset: 'utf-8',
  //   outCharset: 'utf-8',
  //   notice: 0,
  //   format: 'json',
  //   ie: 'utf-8'
  // })

// export function search(query, page, zhida, perpage) {
//   const url = '/api/search'

//   const data = Object.assign({}, commonParams, {
//     w: query,
//     p: page,
//     perpage: perpage,
//     n: perpage,
//     _: 1599102016772,
//     g_tk: 5381,
//     uin: 1296538920,
//     platform: 'h5',
//     needNewCode: 1,
//     g_tk_new_20200303: 5381,
//     zhidaqu: 1,
//     catZhida: zhida ? 1 : 0,
//     t: 0,
//     flag: 1,
//     sem: 1,
//     aggr: 0,
//     remoteplace: 'txt.mqq.all',
//     inCharset: 'utf-8',
//     outCharset: 'utf-8',
//     notice: 0,
//     format: 'json',
//     ie: 'utf-8'
//   })

  return axios.get(url, {
    params: data
  }).then(res => {
    // console.log(res.data);
    return Promise.resolve(res.data)
  })

  
}
