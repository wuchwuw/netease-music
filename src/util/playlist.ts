import Song from './song'
// import User from './user'
import dayjs from 'dayjs'

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

  constructor ({ 
    ordered,
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
    subscribedCount = 0
  }: any) {
    this.tracks = this.createSong(tracks)
    this.trackCount = trackCount
    this.creator = creator
    this.coverImgUrl = coverImgUrl && coverImgUrl + '?param=200y200'
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
  }

  get playCount_string (): string {
    return this.countToString(this.playCount)
  }
  
  get shareCount_string (): string {
    return this.countToString(this.shareCount)
  }

  get subscribedCount_string (): string {
    return this.countToString(this.subscribedCount)
  }

  get tag_string (): string {
    return this.tags.join('/')
  }

  private countToString (count: number): string {
    if (count === 0) return '0'
    return count ? count > 10000 ? `${(count / 10000).toFixed()}万` : `${count}` : ''
  }

  createSong (songs: any): Song[] {
    let res = []
    res = songs && songs.map((item: any) => {
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

  constructor ({ id, name, trackCount, coverImgUrl, creator = {} }: any) {
    this.id = id
    this.name = name
    this.trackCount = trackCount
    this.coverImgUrl = coverImgUrl
    this.creator = creator
  }

  getCoverImgUrl (size: string) {
    if (!this.coverImgUrl) return ''
    return `${this.coverImgUrl}?param=${size}`
  }
}

export function createBasePlaylist (data: any): PlaylistBaseClass[] {
  return data.map((item: any) => {
    return new PlaylistBaseClass({
      id: item.id,
      name: item.name,
      trackCount: item.trackCount,
      coverImgUrl: item.coverImgUrl,
      creator: item.creator
    })
  })
}

export function createPlaylistList (data: any): PlaylistClass[] {
  return data.map((item: any) => {
    return new PlaylistClass(item)
  })
}