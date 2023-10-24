import {commonParams} from './config'
import axios from 'axios'


// 获取歌词
export function getQQLyric(mid) {
  // URL是自己后台代理
  let url = '/api/getQQlyric'
  let data = Object.assign({}, commonParams, {
    songmid: mid,
    pcachetime: +new Date(),
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    var ret = res.data
    // console.log(ret);
    // if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
    //   var matches = ret.match(reg)
    //   if (matches) {
    //     ret = JSON.parse(matches[1])
    //   }
    // }
    return Promise.resolve(ret)
  })
}