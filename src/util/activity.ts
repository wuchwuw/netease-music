import Song, { createSong } from 'UTIL/song'
import { VideoBaseClass } from 'UTIL/video'

export interface Topic {
  actId: number
  title: string
  participateCount: number
  sharePicUrl: string
}

interface ActivityUser {
  nickname: string
  avatarUrl: string
  userId: number
}

interface ActivityInfo {
  commentCount: number
  likedCount: number
  shareCount: number
  liked: boolean
  participateCount: number
}

interface ActivityTopic {
  actId: number
  title: string
  coverPCUrl: string
}

enum ActivityType {
  Song = 18,
  Topic = 33,
  Video = 39,
  Forword = 22
}

export class ActivityClass {
  user: ActivityUser
  type: number
  message: string
  id: number
  eventTime: number
  info: ActivityInfo
  content: Song | VideoBaseClass | ActivityClass | ActivityTopic | null
  activityText: string
  json: any

  constructor ({ user, type, info, id, eventTime, json }: any) {
    this.user = user
    this.type = type
    this.info = info
    this.id = id
    this.eventTime = eventTime
    this.json = JSON.parse(json)
    this.message = ''
    this.activityText = ''
    this.content = null
    this.initContent()
  }

  private initContent () {
    this.message = this.json.msg || ''
    switch (this.type) {
      case 33: // topic
        console.log(this.json)
        this.content = this.json as ActivityTopic
        this.activityText = ''
        break
      case 39:
        this.content = new VideoBaseClass(this.json.video)
        this.activityText = '发布视频'
        break
      case 18:
        this.content = createSong(this.json.song)
        this.activityText = '分享单曲'
        break
      case 22:
        this.content = new ActivityClass(this.json.event)
        this.activityText = '转发'
        break
    }
  }
}

export class ActivitySongClass extends ActivityClass {
  type: number
  content: Song
  constructor () {}
}


export function cretaeActicityList (data: any): ActivityClass[] {
  return data.map((item: any) => {
    return new ActivityClass(item)
  })
}