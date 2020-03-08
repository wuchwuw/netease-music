import { timeFormat } from "./util"
import User from "./user"

export class VideoBaseClass {
  vid: string
  title: string
  coverUrl: string
  duration: number
  playTime: number

  constructor ({vid, title, coverUrl, duration, playTime}: any) {
    this.vid = vid
    this.title = title
    this.coverUrl = coverUrl
    this.duration = duration
    this.playTime = playTime
  }

  get playTime_format (): string {
    if (!this.playTime) return ''
    return this.playTime > 100000 ? `${Math.round(this.playTime / 10000)}万` : String(this.playTime)
  }

  get duration_format (): string {
    if (!this.duration) return ''
    return timeFormat(this.duration / 1000)
  }
}

export class Video extends VideoBaseClass {
  creator: User
  publishTime: number
  praisedCount: number
  commentCount: number
  shareCount: number
  subscribeCount: number
  constructor ({
    vid,
    title,
    coverUrl,
    duration,
    playTime,
    publishTime,
    praisedCount,
    commentCount,
    shareCount,
    subscribeCount,
    creator
  }: any) {
    super({ vid, title, coverUrl, duration, playTime })
    this.creator = new User(creator)
    this.publishTime = publishTime
    this.praisedCount = praisedCount
    this.commentCount = commentCount
    this.shareCount = shareCount
    this.subscribeCount = subscribeCount
  }
}

export function createBaseVideoList (data: any): VideoBaseClass[] {
  return data.map((item: any) => {
    return createBaseVideo(item)
  })
}

export function createBaseVideo (data: any): VideoBaseClass {
  return new VideoBaseClass({
    vid: data.vid,
    duration: data.durationms || data.duration,
    title: data.title,
    coverUrl: data.coverUrl || data.imgurl,
    playTime: data.playTime || data.playCount
  })
}