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
    this.type = 1
  }

}

export function getLyric2(mid) {
  // console.log("getLyric执行了");

  return new Promise((resolve, reject) => {
    // console.log("getLyric进入了ajax分支");
    const url = "/api/getNetEaseLyric"; // 注意这里url之前一定要const关键字，否则ajax请求不会发起，因为axios在url为undefined时不会发起请求
    axios
      .get(url, { params: { id: mid } })
      .then(({ data: { lrc: { lyric }, code } }) => {
        // console.log("data==>", data)
        // const {
        //   lrc: { lyrics },
        //   code,
        // } = data;
        if (code == 200) {          
          resolve(lyric);
        } else {
          reject("no lyric for this song");
        }
      });
  });
}

export async function getSong(mid) {
  // console.log("开始获取网易云音乐歌曲播放链接.....")
  let url = "/api/getSongNetEase";

  const res = await axios.get(url, {
    params: {
      id: mid
    }
  });
  console.log("song data==>", res.data.data);
  let songurl = res.data.data[0].url;

  return songurl;
}

export function createSong(musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.id,
    singer: musicData.artists[0].name,
    name: musicData.name,
    album: musicData.album.name,
    duration: Math.floor(musicData.duration / 1000),
    image: require("@/assets/imgs/disc.png"), //musicData.artists[0].img1v1Url,
    // url: songUrl
    // `https://music.163.com/song/media/outer/url?id=${musicData.id}.mp3`
  });
}
