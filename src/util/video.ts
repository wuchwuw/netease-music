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
    praisedCount = 0,
    commentCount = 0,
    shareCount = 0,
    subscribeCount = 0,
    creator = {}
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

type VideoType = 'video' | 'mv'
interface CreateBy {
  userName: string
  userId: string
}

export class VideoWidthType extends Video {
  type: VideoType
  createBy: CreateBy[]
  constructor(data: any) {
    super(data)
    this.type = data.type === 1 ? 'video' : 'mv'
    this.createBy = data.creator
  }
}

export function createVideoListWidthType (data: any): VideoWidthType[] {
  if (!data || !data.length) return []
  return data.map((item: any) => new VideoWidthType({
    duration: item.durationms,
    ...item
  }))
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

export function createVideoList (data: any): Video[] {
  return data.map((item: any) => {
    return createVideo(item)
  })
}

export function createVideo (data: any): Video {
  return new Video({
    ...data,
    duration: data.durationms
  })
}