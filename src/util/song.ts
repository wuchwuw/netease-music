import { getSongTime } from './util'

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

  constructor ({ id, name, al, ar, mv, dt }: any) {
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
    return getSongTime(this.duration)
  }

  getSongUrl () {}
}
