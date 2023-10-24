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

// 获取单个歌曲地址
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


// 批量获取歌曲播放地址
export async function getSongs(mids) {
  console.log("getSongs mids=>", mids.join(","))
  let url = '/api/getSong'
  if (!Array.isArray(mids)) {
    return "参数不合法，必须是数组！"
  }

  const res = await axios.get(url, {
    params: {
      id: mids.join(","),
    }
  })

  let songurls = res.data.hasOwnProperty("data") ? res.data.data : null
  return songurls


}

export async function createSongList(songs) {
  const songlist = songs.map((song) => createSongwithoutPlayUrl(song))
  console.log("songlist =>", songlist)
  return getSongs(songlist.map((item) => item.mid)).then((data) => {
    // console.log("getSong data ==>", data);
    return songlist.map((song) => {
      song.url = data[song.mid];
      return song;
    });
  });
}


export function createSongwithoutPlayUrl(song) {
  return new Song({
    id: song.songid,
    mid: song.songmid,
    singer: filterSinger(song.singer),
    name: song.songname,
    album: song.albumname,
    duration: song.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`,
   
  })
}

export async function createSong(song) {  
  const songUrl = await getSong(song.songmid)

  // console.log('----------------------------------------');
  // console.log(songUrl)

  return new Song({
    id: song.songid,
    mid: song.songmid,
    singer: filterSinger(song.singer),
    name: song.songname,
    album: song.albumname,
    duration: song.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${song.albummid}.jpg?max_age=2592000`,
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