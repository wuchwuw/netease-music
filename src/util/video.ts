import { timeFormat } from "./util"

export class VideoBaseClass {
  id: string
  title: string
  coverUrl: string
  duration: number
  playTime: number

  constructor ({id, title, coverUrl, duration, playTime}: any) {
    this.id = id
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

export function createBaseVideoList (data: any): VideoBaseClass[] {
  return data.map((item: any) => {
    return createVideo(item)
  })
}

export function createVideo (data: any): VideoBaseClass {
  return new VideoBaseClass({
    id: data.vid,
    duration: data.durationms || data.duration,
    title: data.title,
    coverUrl: data.coverUrl || data.imgurl,
    playTime: data.playTime || data.playCount
  })
}