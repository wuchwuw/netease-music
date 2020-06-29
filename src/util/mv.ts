import { timeFormat } from "./util"
import { Artist, createArtistList } from "UTIL/artist"

export class MV {
  id: number
  name: string
  playCount: number
  subCount: number
  shareCount: number
  likedCount: number
  commentCount: number
  duration: number
  publishTime: string
  cover: string
  artists: Artist[]

  subed: boolean
  liked: boolean

  constructor ({
    id,
    name,
    playCount = 0,
    subCount = 0,
    shareCount = 0,
    likedCount = 0,
    commentCount = 0,
    duration = 0,
    publishTime,
    cover,
    artists = [{ img1v1Url: '', name: '' }],
    subed = false,
    liked = false
  }: any) {
    this.id = id
    this.name = name
    this.playCount = playCount
    this.subCount = subCount
    this.shareCount = shareCount
    this.likedCount = likedCount
    this.commentCount = commentCount
    this.duration = duration
    this.publishTime = publishTime
    this.cover = cover
    this.artists = artists.length ? createArtistList(artists) : []
    this.subed = subed
    this.liked = liked
  }

  get playCount_format (): string {
    return this.playCount > 10000 ? `${Math.round(this.playCount / 10000)}万` : String(this.playCount)
  }

  get duration_format (): string {
    return timeFormat(this.duration / 1000)
  }

}

export function createMV (data: any): MV {
  return new MV({
    ...data,
    cover: data.cover || data.picUrl || data.imgurl16v9
  })
}

export function createMVList (data: any): MV[] {
  return data.map((item: any) => createMV(item))
}

export function createArtistMVList (data: any): MV[] {
  return data.map((item: any) => new MV({
    id: item.id,
    name: item.name,
    cover: item.imgurl16v9,
    duration: item.duration,
    playCount: item.playCount
  }))
}

export function createPrivateContentMVList (data: any): MV[] {
  return data.map((item: any) => new MV({
    id: item.id,
    name: item.name,
    cover: item.picUrl
  }))
}