const Mock = require('mockjs')
import axios from "axios"

const headers = {
    referer: 'https://y.qq.com/',
    origin: 'https://y.qq.com/',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36'
}


Mock.mock("/testmock", "get", (ctx) => { return "this is mock test" })
Mock.mock("/getSingerDetail", "get", (ctx) => {

    return "this is mockjs route /getSingerDetail"
    // const url = "https://u.y.qq.com/cgi-bin/musics.fcg";
    // return new Promise((resolve,reject) => {
    //     const params = ctx.query
    //     console.log("mock get params==>",params)
    //     axios.get(url, {
    //         headers,
    //         params
    //     }).then((res) => {
    //         console.log("mockjs res==>", res)
    //         resolve(res)
    //     }).catch((err)=> reject(err))
    // })


})



