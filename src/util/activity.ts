import Song, { createSong } from 'UTIL/song'
import dayjs from 'dayjs'
import { VideoBaseClass, createVideo } from 'UTIL/video'
import { createBaseAlbum, AlbumBaseClass } from 'UTIL/album'
import { MV, createMV } from './mv'
import { PlaylistClass, createPlaylist } from './playlist'
import { createArtist, Artist } from './artist'

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

interface ActivityImage {
  height: number
  width: number
  originUrl: string
  pcSquareUrl: string
}

export interface ActivityInfo {
  commentCount: number
  likedCount: number
  shareCount: number
  liked: boolean
  commentThread: {
    id: string
  }
}

interface ActivityTopic {
  actId: number
  title: string
  coverPCUrl: string
  participateCount: number
}

export enum ActivityType {
  Song = 18,
  Topic = 33,
  Video = 39,
  VideoShare = 41,
  MV = 21,
  Forword = 22,
  Album = 19,
  PLAYLIST = 13,
  ARTIST = 36
}

export class ActivityClass {
  user: ActivityUser
  id: number
  eventTime: number
  showTime: number
  info: ActivityInfo
  pics: ActivityImage[]
  json: any

  constructor ({ user, info, id, eventTime, showTime, pics }: any) {
    this.user = user
    this.info = info
    this.id = id
    this.eventTime = eventTime
    this.showTime = showTime
    this.pics = pics
  }

  get eventTimeFormat () {
    return this.eventTime ? dayjs(this.eventTime).format('YYYY年MM月DD日 HH:MM') : ''
  }

  get showTimeFormat () {
    return this.showTime ? dayjs(this.showTime).format('YYYY年MM月DD日 HH:MM') : ''
  }
}

export class ActivitySongClass extends ActivityClass {
  type: ActivityType.Song
  activityText: string
  message: string
  content: Song
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
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
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = this.json
    this.message = this.json.msg
    this.activityText = ''
  }
}

export class ActivityVideoClass extends ActivityClass {
  type: ActivityType.Video | ActivityType.VideoShare
  activityText: string
  message: string
  content: VideoBaseClass
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createVideo({
      ...this.json.video,
      vid: this.json.video.videoId
    })
    this.message = this.json.msg
    this.activityText = type === ActivityType.Video ? '发布视频' : '分享视频'
  }
}

export class ActivityForwordClass extends ActivityClass {
  type: ActivityType.Forword
  activityText: string
  message: string
  content: ActivityClassType
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
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
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createBaseAlbum(this.json.album)
    this.message = this.json.msg
    this.activityText = '分享专辑'
  }
}

export class ActivityMVClass extends ActivityClass {
  type: ActivityType.MV
  activityText: string
  message: string
  content: MV
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createMV(this.json.mv)
    this.message = this.json.msg
    this.activityText = '分享MV'
  }
}

export class ActivityPlaylistClass extends ActivityClass {
  type: ActivityType.PLAYLIST
  activityText: string
  message: string
  content: PlaylistClass
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createPlaylist(this.json.playlist)
    this.message = this.json.msg
    this.activityText = '分享歌单'
  }
}

export class ActivityArtistClass extends ActivityClass {
  type: ActivityType.ARTIST
  activityText: string
  message: string
  content: Artist
  constructor ({ user, type, info, id, eventTime, json, showTime, pics }: any) {
    super({user, info, id, eventTime, showTime, pics })
    this.type = type
    this.json = JSON.parse(json)
    this.content = createArtist(this.json.resource)
    this.message = this.json.msg
    this.activityText = '分享歌手'
  }
}

export function cretaeActicity (data: any): ActivityClassType {
  switch (data.type) {
    case ActivityType.Topic:
      return new ActivityTopicClass(data)
    case ActivityType.Song:
      return new ActivitySongClass(data)
    case ActivityType.Video:
    case ActivityType.VideoShare:
      return new ActivityVideoClass(data)
    case ActivityType.Forword:
      return new ActivityForwordClass(data)
    case ActivityType.Album:
      return new ActivityAlbumClass(data)
    case ActivityType.MV:
      return new ActivityMVClass(data)
    case ActivityType.PLAYLIST:
      return new ActivityPlaylistClass(data)
    case ActivityType.ARTIST:
      return new ActivityArtistClass(data)
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
  ActivityAlbumClass |
  ActivityMVClass |
  ActivityPlaylistClass |
  ActivityArtistClass