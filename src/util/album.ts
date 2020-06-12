import { Artist, createArtist } from 'UTIL/artist'
import Song, { createSongList } from 'UTIL/song'
import dayjs from 'dayjs'

export class AlbumBaseClass {
  id: number
  name: string
  picUrl: string
  artists: any

  constructor ({ id, name, picUrl, artists = [] } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
    this.artists = artists
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name: string, item: any) => {
      return name + '/' + item.name
    }, '').substring(1)
  }
}

export function createBaseAlbum (data: any): AlbumBaseClass {
  return new AlbumBaseClass(data)
}

export function createBaseAlbumList (data: any): AlbumBaseClass[] {
  return data.map((item: any) => {
    return new AlbumBaseClass(item)
  })
}

interface AlbumInfo {
  isSub: boolean
  subCount: number
  // liked: boolean
  commentCount: number
  // likedCount: number
  shareCount: number
}

export class Album {
  id: number
  name: string
  picUrl: string
  artists: Artist[]
  songs: Song[]
  commentThreadId: string
  publishTime: number
  paid: boolean
  onSale: boolean
  info: AlbumInfo
  description: string
  size: number
  alia: String[]
  constructor ({
    id,
    name,
    picUrl,
    artists = [],
    songs = [],
    commentThreadId,
    publishTime,
    paid,
    onSale,
    info = {
      shareCount: 0,
      commentCount: 0,
      subCount: 0,
      isSub: false
    },
    description,
    size = 0,
    alia = []
  } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
    this.artists = artists.map((item: any) => createArtist(item))
    this.songs = createSongList(songs)
    this.commentThreadId = commentThreadId
    this.publishTime = publishTime
    this.onSale = onSale
    this.paid = paid
    this.info = info
    this.description = description
    this.size = size
    this.alia = alia
  }

  get alia_string (): string {
    return this.alia.length ? `（${this.alia.join('、')}）` : ''
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name: string, item: any) => {
      return name + '/' + item.name
    }, '').substring(1)
  }

  get publishTimeFormat () {
    return this.publishTime ? dayjs(this.publishTime).format('YYYY-MM-DD') : ''
  }
}

export function createAlbum (data: any): Album {
  return new Album ({
    ...data,
    alia: data.alia || data.alias,
    artists: data.artists || [data.artist]
  })
}

export function createAlbumList (data: any): Album[] {
  return data.map((item: any) => {
    return createAlbum(item)
  })
}