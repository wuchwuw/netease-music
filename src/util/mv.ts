import { timeFormat } from "./util"
import { Artist, createArtistList } from "UTIL/artist"

export class MV {
  id: number
  name: string
  playCount: number
  subCount: number
  shareCount: number
  likeCount: number
  commentCount: number
  duration: number
  publishTime: string
  cover: string
  artists: Artist[]

  constructor ({
    id,
    name,
    playCount = 0,
    subCount = 0,
    shareCount = 0,
    likeCount = 0,
    commentCount = 0,
    duration = 0,
    publishTime,
    cover,
    artists = []
  }: any) {
    this.id = id
    this.name = name
    this.playCount = playCount
    this.subCount = subCount
    this.shareCount = shareCount
    this.likeCount = likeCount
    this.commentCount = commentCount
    this.duration = duration
    this.publishTime = publishTime
    this.cover = cover
    this.artists = createArtistList(artists)
  }

  get playCount_format (): string {
    return this.playCount > 100000 ? `${Math.round(this.playCount / 10000)}万` : String(this.playCount)
  }

  get duration_format (): string {
    return timeFormat(this.duration / 1000)
  }
}

export function createMVList (data: any): MV[] {
  return data.map((item: any) => new MV(item))
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