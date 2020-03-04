import { Artist, createArtist } from 'UTIL/artist'
import Song, { createSongList } from 'UTIL/song'

export class AlbumBaseClass {
  id: number
  name: string
  picUrl: string
  artists: any

  constructor ({ id, name, picUrl, artists } : any) {
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
  constructor ({ 
    id, 
    name, 
    picUrl, 
    artists = [], 
    songs = [],
    commentThreadId,
    publishTime,
    paid, 
    onSale
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
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name: string, item: any) => {
      return name + '/' + item.name
    }, '').substring(1)
  }
}

export function createAlbum (data: any): Album {
  return new Album (data)
}

export function createAlbumList (data: any): Album[] {
  return data.map((item: any) => {
    return new Album(item)
  })
}