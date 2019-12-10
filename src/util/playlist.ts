import Song from './song'
// import User from './user'
import dayjs from 'dayjs'

interface Creator {
  avatarUrl: string
  nickname: string
  signature: string
}

export default class PlaylistClass {
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

  constructor ({ trackCount, tags = [], tracks = [], creator = {}, coverImgUrl, commentCount, createTime, id, name, playCount, shareCount, highQuality}: any) {
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
  }

  get playCount_string (): string {
    return this.playCount ? this.playCount > 10000 ? `${(this.playCount / 10000).toFixed()}万` : `${this.playCount}` : ''
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