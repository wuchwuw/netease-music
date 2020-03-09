import { timeFormat } from "./util"
import { Artist, createArtist } from "UTIL/artist"

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
  artist: Artist

  constructor ({
    id,
    name,
    playCount = 0,
    subCount = 0,
    shareCount = 0,
    likeCount = 0,
    commentCount = 0,
    duration,
    publishTime,
    cover,
    artist = {}
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
    this.artist = createArtist(artist)
  }

  get playCount_format (): string {
    if (!this.playCount) return ''
    return this.playCount > 100000 ? `${Math.round(this.playCount / 10000)}万` : String(this.playCount)
  }

  get duration_format (): string {
    if (!this.duration) return ''
    return timeFormat(this.duration / 1000)
  }
}