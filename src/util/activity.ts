import Song, { createSong } from 'UTIL/song'
import dayjs from 'dayjs'
import { VideoBaseClass, createVideo } from 'UTIL/video'
import { createAlbum, AlbumBaseClass } from 'UTIL/album'

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
  Forword = 22,
  Album = 19
}

export class ActivityClass {
  user: ActivityUser
  id: number
  eventTime: number
  info: ActivityInfo
  json: any

  constructor ({ user, info, id, eventTime }: any) {
    this.user = user
    this.info = info
    this.id = id
    this.eventTime = eventTime
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
    super({user, info, id, eventTime })
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
  message: string
  content: ActivityTopic
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime })
    this.type = type
    this.json = JSON.parse(json)
    this.content = this.json
    this.message = this.json.msg
    this.activityText = ''
  }
}

export class ActivityVideoClass extends ActivityClass {
  type: ActivityType.Video
  activityText: string
  message: string
  content: VideoBaseClass
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createVideo(this.json.video)
    this.message = this.json.msg
    this.activityText = '发布视频'
  }
}

export class ActivityForwordClass extends ActivityClass {
  type: ActivityType.Forword
  activityText: string
  message: string
  content: ActivityClassType
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime })
    this.type = type
    this.json = JSON.parse(json)
    this.content = cretaeActicity(this.json.event)
    this.message = this.json.msg
    this.activityText = '转发'
  }
}

export class ActivityAlbumClass extends ActivityClass {
  type: ActivityType.Album
  activityText: string
  message: string
  content: AlbumBaseClass
  constructor ({ user, type, info, id, eventTime, json }: any) {
    super({user, info, id, eventTime })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createAlbum(this.json.album)
    this.message = this.json.msg
    this.activityText = '分享专辑'
  }
}

function cretaeActicity (data: any): ActivityClassType {
  switch (data.type) {
    case ActivityType.Topic:
      return new ActivityTopicClass(data)
    case ActivityType.Song:
      return new ActivitySongClass(data)
    case ActivityType.Video:
      return new ActivityVideoClass(data)
    case ActivityType.Forword:
      return new ActivityForwordClass(data)
    case ActivityType.Album:
      return new ActivityAlbumClass(data)
    default:
      return new ActivityTopicClass(data)
  }
}

export function cretaeActicityList (data: any): ActivityClassType[] {
  return data.map((item: any) => {
    return cretaeActicity(item)
  })
}

export type ActivityClassType =
  ActivityTopicClass |
  ActivitySongClass |
  ActivityVideoClass |
  ActivityForwordClass |
  ActivityAlbumClass