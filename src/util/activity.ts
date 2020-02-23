import Song, { createSong } from 'UTIL/song'
import dayjs from 'dayjs'
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

export enum ActivityType {
  Song = 18,
  Topic = 33,
  Video = 39,
  Forword = 22
}

export class ActivityClass {
  user: ActivityUser
  id: number
  eventTime: number
  info: ActivityInfo
  json: any

  constructor ({ user, type, info, id, eventTime }: any) {
    this.user = user
    this.info = info
    this.id = id
    this.eventTime = eventTime
    this.message = ''
  }

  get eventTimeFormat () {
    return this.eventTime ? dayjs(this.eventTime).format('YYYY年MM月DD日 HH:MM') : ''
  }
}

export class ActivitySongClass extends ActivityClass {
  type: ActivityType.Song
  activityText: string
  message: string
  content: Song
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime, json })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createSong(this.json.song)
    this.message = this.json.msg
    this.activityText = '分享单曲'
  }
}

export class ActivityTopicClass extends ActivityClass {
  type: ActivityType.Topic
  activityText: string
  content: ActivityTopic
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime, json })
    this.type = type
    this.json = JSON.parse(json)
    this.content = this.json
    this.activityText = ''
  }
}


export function cretaeActicityList (data: any): ActivityClassType[] {
  return data.map((item: any) => {
    switch (item.type) {
      case ActivityType.Topic:
        return new ActivityTopicClass(item)
      case ActivityType.Song:
        return new ActivitySongClass(item)
      default:
        return {}
    }
  })
}

export type ActivityClassType = ActivityTopicClass | ActivitySongClass