import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
import axios from 'axios'

export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
}

export async function getSong(mid) {
  let url = '/api/getSong'

  return await axios.get(url, {
    params: {
      // songmid: mid,
      // guid: 85640610
      id: mid,
    }
  }).then((res) => {
    // console.log(res.data.data);
    // let songurl = res.data.data.musicUrl 
    let songurl = res.data.data[mid]
    // console.log(songurl);
    return songurl
  })


}

export async function createSong(musicData) {
  let songUrl = '123'
  await getSong(musicData.songmid).then((data) => {
    return Promise.resolve(data)
  }).then((res) => { songUrl = res })

  // console.log('----------------------------------------');
  // console.log(songUrl)

  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: songUrl
  })
}
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}