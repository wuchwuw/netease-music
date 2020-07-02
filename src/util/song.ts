import { timeFormat } from 'UTIL/util'
import api from 'API/index'
import Lyric from './lyric-parser'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import { AlbumBaseClass, createBaseAlbum } from 'UTIL/album'

interface SongPrivilege {
  cp: number
  playMaxbr: number
  payed: number
  fee: number
  st: number
  sp: number
  maxbr: number
}

export default class Song {
  name: string
  id: number
  artists: ArtistBaseClass[]
  mv: number
  album: AlbumBaseClass
  duration: number
  lyric: any
  alia: string[]
  privilege: SongPrivilege

  constructor ({
    id,
    name,
    al = {},
    ar = [],
    mv,
    dt,
    alia = [],
    privilege = {}
  }: any) {
    this.id = id
    this.name = name
    this.artists = ar ? createBaseArtistList(ar) : []
    this.mv = mv
    this.album = al ? createBaseAlbum(al) : {} as AlbumBaseClass
    this.duration = dt
    this.lyric = null
    this.alia = alia || []
    this.privilege = privilege
  }

  get alia_string (): string {
    return this.alia.length ? `（${this.alia.join('、')}）` : ''
  }

  get duration_string (): string {
    if (!this.duration) return ''
    return timeFormat(this.duration / 1000)
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name, item) => {
      return name + '/' + item.name
    }, '').substring(1)
  }

  get isHighQuality (): boolean {
    const { playMaxbr, maxbr } = this.privilege
    return playMaxbr === 999000 || maxbr === 999000
  }

  get isVip (): boolean {
    const { cp, fee, payed } = this.privilege
    return cp === 0 && fee > 0 && payed === 0
  }

  get hasPublish (): boolean {
    const { cp, st } = this.privilege
    return !(cp === 0 && st < 0)
  }

  async getLyric (cb?: any) {
    try {
      let res = await api.getLyric({ id: this.id })
      const lyric = new Lyric(res.data)
      this.lyric = lyric
      cb && cb(lyric)
    } catch (e) {}
  }
}

export function createSongList (data: any): Song[] {
  return data.map((item: any) => {
    return createSong(item)
  })
}

export function createSong (data: any): Song {
  return new Song({
    id: data.id,
    ar: data.artists || data.ar,
    al: data.album || data.al,
    dt: data.duration || data.dt,
    name: data.name,
    mv: data.mv || data.mvid,
    alia: data.alia,
    privilege: data.privilege
  })
}

export function getSongList (ids: number[]): Promise<Song[]> {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await api.getSongDetail({ ids })
      const songs = res.data.songs.map((item: any, index: number) => {
        return createSong({
          ...item,
          privilege: res.data.privileges[index]
        })
      })
      resolve(songs)
    } catch (e) {
      reject(e)
    }
  })
}