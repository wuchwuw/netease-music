import Song from './song'
import dayjs from 'dayjs'
import { countToString } from 'UTIL/util'

interface Creator {
  avatarUrl: string
  nickname: string
  userId: number
}

export class PlaylistClass {
  tracks: Song[]
  trackCount: number
  creator: Creator
  coverImgUrl: string
  commentCount: number
  createTime: number
  createTimeString: string
  id: number
  name: string
  playCount: number
  shareCount: number
  highQuality: boolean
  tags: string[]
  ordered: boolean
  description: string
  subscribedCount: number
  subscribed: boolean
  constructor ({
    ordered = false,
    trackCount = 0,
    tags = [],
    tracks = [],
    creator = {},
    coverImgUrl,
    commentCount = 0,
    createTime,
    id,
    name,
    playCount = 0,
    shareCount = 0,
    highQuality,
    description,
    subscribedCount = 0,
    subscribed
  }: any) {
    this.tracks = tracks ? this.createSong(tracks) : []
    this.trackCount = trackCount
    this.creator = creator
    this.coverImgUrl = coverImgUrl && coverImgUrl + '?param=300y300'
    this.commentCount = commentCount
    this.createTime = createTime
    this.createTimeString = dayjs(createTime).format('YYYY-MM-DD')
    this.id = id
    this.name = name
    this.playCount = playCount
    this.shareCount = shareCount
    this.highQuality = highQuality
    this.tags = tags
    this.ordered = ordered
    this.description = description
    this.subscribedCount = subscribedCount
    this.subscribed = subscribed
  }

  get playCount_string (): string {
    return countToString(this.playCount)
  }

  get shareCount_string (): string {
    return countToString(this.shareCount)
  }

  get subscribedCount_string (): string {
    return countToString(this.subscribedCount)
  }

  get tag_string (): string {
    return this.tags.join('/')
  }

  createSong (songs: any): Song[] {
    let res = []
    res = songs.map((item: any) => {
      return new Song(item)
    })
    return res
  }
}

export class PlaylistBaseClass {
  id: number
  name: string
  trackCount: number
  coverImgUrl: string
  creator: Creator
  playCount: number

  constructor ({ id, name, trackCount, coverImgUrl, creator = {}, playCount = 0 }: any) {
    this.id = id
    this.name = name
    this.trackCount = trackCount
    this.coverImgUrl = coverImgUrl
    this.creator = creator
    this.playCount = playCount
  }

  get playCount_string (): string {
    return countToString(this.playCount)
  }
}

export function createBasePlaylist (data: any): PlaylistBaseClass[] {
  return data.map((item: any) => {
    return new PlaylistBaseClass({
      id: item.id,
      name: item.name,
      trackCount: item.trackCount,
      coverImgUrl: item.coverImgUrl || item.picUrl,
      creator: item.creator,
      playCount: item.playCount
    })
  })
}

export function createPlaylistList (data: any): PlaylistClass[] {
  return data.map((item: any) => {
    return new PlaylistClass({
      coverImgUrl: item.coverImgUrl || item.picUrl,
      ...item
    })
  })
}