import { PlaylistClass, createPlaylist } from "./playlist"
import { Video, createVideo } from "./video"
import { MV, createMV } from "./mv"
import { Album, createAlbum } from "./album"
import Song, { createSong } from "./song"
import Comment from './comment'
import dayjs from "dayjs"
import { ActivityClassType, cretaeActicity } from "./activity"

export enum ForwardType {
  EVENT = 1,
  COMMENT = 3
}

export enum ForwardSourceType {
  SONG = 4,
  PLAYLIST = 0,
  ALBUM = 3,
  MV = 5,
  VIDEO = 62,
  DEFAULT = -1
}

interface ForwardSongSource {
  type: ForwardSourceType.SONG
  content: Song
}
interface ForwardPlaylistSource {
  type: ForwardSourceType.PLAYLIST
  content: PlaylistClass
}
interface ForwardVideoSource {
  type: ForwardSourceType.VIDEO
  content: Video
}
interface ForwardAlbumSource {
  type: ForwardSourceType.ALBUM
  content: Album
}
interface ForwardMVSource {
  type: ForwardSourceType.MV
  content: MV
}
interface ForwardDefaultSource {
  type: ForwardSourceType.DEFAULT
  content: null
}

export type ForwardSource = Song | PlaylistClass | Video | Album | MV | null
export type ForwardSourceContentType = ForwardSongSource | ForwardPlaylistSource | ForwardVideoSource | ForwardMVSource | ForwardAlbumSource | ForwardDefaultSource
export type ForwardClassType = ForwardComment | ForwardEvent

export default class Forward {
  id: number
  userId: number
  time: number
  constructor ({ id, userId, time }: any) {
    this.time = time
    this.id = id
    this.userId = userId
  }
  get timeFormat () {
    return this.time ? dayjs(this.time).format('YYYY年MM月DD日 HH:MM') : ''
  }
}

export class ForwardComment extends Forward {
  resource: ForwardSourceContentType
  comment: Comment
  type: ForwardType.COMMENT
  constructor ({ id, userId, type, json, time }: any) {
    super({ id, userId, time})
    const resource = JSON.parse(json)
    this.resource = {
      type: resource.resourceType,
      content: createForwardSource(resource.resourceType, resource.resource)
    }
    this.comment = new Comment(resource.comment)
    this.type = type
  }
}

export class ForwardEvent extends Forward {
  type: ForwardType.EVENT
  event: ActivityClassType
  constructor ({ id, userId, type, json, time }: any) {
    super({ id, userId, time})
    const resource = JSON.parse(json)
    this.event = cretaeActicity(resource)
    this.type = type
  }
}

function createForwardSource (resourceType: number, rsource: any): ForwardSource {
  switch (resourceType) {
    case ForwardSourceType.SONG:
      return createSong(rsource)
    case ForwardSourceType.PLAYLIST:
      return createPlaylist(rsource)
    case ForwardSourceType.ALBUM:
      return createAlbum(rsource)
    case ForwardSourceType.VIDEO:
      return createVideo(rsource)
    case ForwardSourceType.MV:
      return createMV(rsource)
    default:
      return null
  }
}

export function createForward (data: any) {
  switch (data.type) {
    case ForwardType.COMMENT:
      return new ForwardComment(data)
    case ForwardType.EVENT:
      return new ForwardEvent(data)
  }
}

export function createForwardList (data: any): ForwardClassType[] {
  return data.map((item: any) => (
    createForward(item)
  ))
}