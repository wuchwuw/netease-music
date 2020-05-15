import User from "./user"
import { Album } from "./album"
import { Video } from "./video"
import { PlaylistClass } from "./playlist"

export enum ChatContentType {
  ALBUM = 'album',
  VIDEO = 'video',
  TEXT = 'text',
  PLAYLIST = 'playlist'
}

const ChatContentTypeMap = {
  2: ChatContentType.ALBUM,
  4: ChatContentType.PLAYLIST,
  6: ChatContentType.TEXT,
  7: ChatContentType.VIDEO,
}

interface ChatAlbumContent {
  type: ChatContentType.ALBUM
  content: Album
}

interface ChatVideoContent {
  type: ChatContentType.VIDEO
  content: Video
}

interface ChatTextContent {
  type: ChatContentType.TEXT
  content: string
}

interface ChatPlaylistContent {
  type: ChatContentType.PLAYLIST
  content: PlaylistClass
}

type ChatContent = (ChatAlbumContent | ChatVideoContent | ChatTextContent | ChatPlaylistContent)

export class Chat {
  id: number
  time: number
  fromUser: User
  toUser: User
  msg: string
  content: ChatContent
  constructor ({ id, time, fromUser = {}, toUser = {}, msg} : any) {
    this.id = id
    this.time = time
    this.fromUser = new User(fromUser)
    this.toUser = new User(toUser)
    const content = JSON.parse(msg)
    this.msg = content.msg
    this.content = getContent(content)
  }
}

function getContent (data: any): ChatContent {
  const type: ChatContentType = ChatContentTypeMap[data.type as keyof typeof ChatContentTypeMap]
  let content: any
  switch (type) {
    case ChatContentType.ALBUM:
      content = new Album(data.album)
      break
    case ChatContentType.VIDEO:
      content = new Video(data.video)
      break
    case ChatContentType.PLAYLIST:
      content = new PlaylistClass(data.playlist)
      break
    case ChatContentType.TEXT:
    default:
      content = data.msg
      break
  }
  return { content, type }
}

export function createChatList (data: any[]) {
  return data.map(item => new Chat(item))
}