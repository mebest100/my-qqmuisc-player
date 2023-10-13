import axios from "axios";

// 以下为从网易云音乐获取歌曲
export default class Song {
  constructor({ id, mid, singer, name, album, duration, image, url }) {
    this.id = id;
    this.mid = mid;
    this.singer = singer;
    this.name = name;
    this.album = album;
    this.duration = duration;
    this.image = image;
    this.url = url;
  }

  getLyric() {
    return
  }
}

export async function getSong(mid) {
  let url = "/api/getSongNetEase";

 const res = await axios.get(url, {
    params: {
      id: mid,
    },
  });
  console.log("song data==>", res.data.data)
  let songurl = res.data.data[0].url;

  return songurl;
}

export async function createSong(musicData) {
  const songUrl = await getSong(musicData.id);

  return new Song({
    id: musicData.id,
    mid: musicData.id,
    singer: musicData.artists[0].name,
    name: musicData.name,
    album: musicData.album.name,
    duration: Math.floor(musicData.duration/1000),
    image: musicData.artists[0].img1v1Url,
    url: songUrl,
  });
}
