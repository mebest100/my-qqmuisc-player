import { getLyric } from 'api/song'
import { ERR_OK } from 'api/config'
import { Base64 } from 'js-base64'
import axios from 'axios'
import { getSongs } from "./song"

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
}


export function getLyric3(mid) {
  return new Promise((resolve, reject) => {
    getLyric(mid).then((res) => {
      if (res.retcode === ERR_OK) {
       const lyric = Base64.decode(res.lyric)
       console.log("解密后的qq歌词==》", lyric);
        resolve(lyric)
      } else {
        reject('no lyric')
      }
    })
  })
}

export async function getSong(mid) {
  let url = '/api/getSong'

  const res = await axios.get(url, {
    params: {
      id: mid,
    }
  })
  // 获取qq音乐网址时要先判断一下是否有mid字段
  let songurl = res.data.data.hasOwnProperty(mid) ? res.data.data[mid] : ''
  return songurl


}

export async function createSongList(songlist) {
  console.log("Singer detail's songlist =>", songlist)
  return getSongs(songlist.map((item) => item.mid)).then((data) => {
    // console.log("getSong data ==>", data);
    return songlist.map((song) => {
      song.url = data[song.mid];
      return song;
    });
  });
}


export async function createSong(musicData) {  
  const songUrl = await getSong(musicData.mid)
  musicData.url = songUrl
  return musicData

  // return new Song({
  //   id: musicData.id,
  //   mid: musicData.mid,
  //   singer: musicData.singer,
  //   name: musicData.name,
  //   album: musicData.album,
  //   duration: musicData.duration,
  //   image: musicData.image,
  //   // image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
  //   url: songUrl
  // })
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