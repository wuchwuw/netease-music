import { getSongTime } from 'UTIL/util'
import api from 'API/index'

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

  constructor ({ id, name, al = {}, ar = [], mv, dt }: any) {
    this.id = id
    this.name = name
    this.ar = ar
    this.mv = mv
    this.picUrl = al.picUrl
    this.albumId = al.id
    this.albumName = al.name
    this.duration = dt
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

// export function createSong ({ id, name, al, ar, mv, dt }: any): Song {
//   return new Song()
// }