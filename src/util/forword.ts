import { PlaylistClass, createPlaylist } from "./playlist"
import { Video, createVideo } from "./video"
import { MV, createMV } from "./mv"
import { Album, createAlbum } from "./album"
import Song, { createSong } from "./song"
import Comment from './comment'
import dayjs from "dayjs"

export enum ForwordSourceType {
  SONG = 4,
  PLAYLIST = 0,
  ALBUM = 3,
  MV = 5,
  VIDEO = 62,
  DEFAULT = -1
}

interface ForwordSongSource {
  type: ForwordSourceType.SONG
  content: Song
}
interface ForwordPlaylistSource {
  type: ForwordSourceType.PLAYLIST
  content: PlaylistClass
}
interface ForwordVideoSource {
  type: ForwordSourceType.VIDEO
  content: Video
}
interface ForwordAlbumSource {
  type: ForwordSourceType.ALBUM
  content: Album
}
interface ForwordMVSource {
  type: ForwordSourceType.MV
  content: MV
}
interface ForwordDefaultSource {
  type: ForwordSourceType.DEFAULT
  content: {}
}

export type ForwordSource =
  ForwordSongSource |
  ForwordPlaylistSource |
  ForwordVideoSource |
  ForwordAlbumSource |
  ForwordMVSource |
  ForwordDefaultSource

class Forward {
  type: number
  resource: ForwordSource
  comment: Comment
  time: number
  constructor ({ type, json, time }: any) {
    const resource = JSON.parse(json)
    this.resource = createForwardSource(resource.resourceType, resource.resource)
    this.comment = new Comment(resource.comment)
    this.type = type
    this.time = time
  }
  get timeFormat () {
    return this.time ? dayjs(this.time).format('YYYY年MM月DD日 HH:MM') : ''
  }
}

function createForwardSource (resourceType: number, rsource: any): ForwordSource {
  switch (resourceType) {
    case ForwordSourceType.SONG:
      return { type: resourceType, content: createSong(rsource) }
    case ForwordSourceType.PLAYLIST:
      return { type: resourceType, content: createPlaylist(rsource) }
    case ForwordSourceType.ALBUM:
      return { type: resourceType, content: createAlbum(rsource) }
    case ForwordSourceType.VIDEO:
      return { type: resourceType, content: createVideo(rsource) }
    case ForwordSourceType.MV:
      return { type: resourceType, content: createMV(rsource) }
    default:
      return { type: resourceType, content: {} }
  }
}

export function createForwardList (data: any) {
  return data.map((item: any) => (
    new Forward(item)
  ))
}

export default Forward