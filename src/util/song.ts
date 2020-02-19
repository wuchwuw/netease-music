import { getSongTime } from 'UTIL/util'
import api from 'API/index'
import Lyric from './lyric-parser'

interface SongArtist {
  id: number
  name: string
}

export default class Song {
  name: string
  id: number
  ar: SongArtist[]
  mv: number
  picUrl: string
  albumId: number
  albumName: string
  duration: number
  lyric: any

  constructor ({ id, name, al = {}, ar = [], mv, dt }: any) {
    this.id = id
    this.name = name
    this.ar = ar
    this.mv = mv
    this.picUrl = al.picUrl
    this.albumId = al.id
    this.albumName = al.name
    this.duration = dt
    this.lyric = null
  }

  get duration_string (): string {
    if (!this.duration) return ''
    return getSongTime(this.duration / 1000)
  }

  get artistName (): string {
    if (!this.ar.length) return ''
    return this.ar.reduce((name, item) => {
      return name + '/' + item.name
    }, '').substring(1)
  }

  async getLyric (cb?: any) {
    try {
      let res = await api.getLyric(this.id)
      const lyric = new Lyric(res.data.lrc.lyric)
      this.lyric = lyric
      cb && cb(lyric)
    } catch (e) {}
  }
  // async getSongUrl () {
  //   try {
  //     let res = await api.getSongUrl({ id: this.id })
  //     // return res.data.data[0].url
  //     let audio = document.querySelector('#player-audio')
  //     audio!.src = res.data.data[0].url
  //     audio.play()
  //   } catch (e) {}
  // }
}

export async function play (currentSong: Song) {
  try {
    let audio = document.querySelector('#player-audio')
    audio.currentTime = 0
    let res = await api.getSongUrl({ id: currentSong.id })
    audio!.src = res.data.data[0].url
    audio.play()
  } catch (e) {}
}

export function createSongList (data: any): Song[] {
  return data.map((item: any) => {
    return new Song({
      id: item.id,
      ar: item.artists,
      al: item.album,
      dt: item.duration,
      name: item.name
    })
  })
}

export function createSong (data: any): Song {
  return new Song({
    id: data.id,
    ar: data.artists,
    al: data.album,
    dt: data.duration,
    name: data.name
  })
}