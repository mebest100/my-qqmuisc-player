import axios from "axios";
// import jsonp from 'common/js/jsonp'
// import { commonParams, options } from './config'

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.135 Safari/537.36",
  referer: "https://y.qq.com/",
  host: "y.qq.com",
};

export function getRecommend() {
  const url = "/api/getRecommend";
  let resp = axios
    .get(url, {
      params: {
        p: Math.random(),
      },
    })
    .then((res) => {
      return Promise.resolve(res);
    });
  return resp;
}

export function getDiscList() {
  const url = "/api/getDiscList";

  return axios
    .get(url, {
      params: {
        p: Math.random(),
      },
    })
    .then((res) => {
      return Promise.resolve(res);
    });
}

export function getSongList(content_id) {
  const url = "/api/getSongList";
  return axios
    .get(url, {
      params: {
        id: content_id,
      },
    })
    .then((res) => {
      return Promise.resolve(res.data);
    });
}
