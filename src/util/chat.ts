import User from "./user"
import { Album } from "./album"
import { Video } from "./video"
import { PlaylistClass } from "./playlist"
import { MV, createMV } from "./mv"

export enum ChatContentType {
  ALBUM = 'album',
  VIDEO = 'video',
  TEXT = 'text',
  PLAYLIST = 'playlist',
  MV = 'mv',
  GENERAL = 'general',
  PROMOTION = 'promotion'
}

const ChatContentTypeMap = {
  2: ChatContentType.ALBUM,
  4: ChatContentType.PLAYLIST,
  6: ChatContentType.TEXT,
  7: ChatContentType.MV,
  12: ChatContentType.PROMOTION,
  24: ChatContentType.VIDEO,
  23: ChatContentType.GENERAL
}

interface ChatGeneralContent {
  type: ChatContentType.GENERAL
  content: {
    webUrl: string,
    cover: string,
    title: string,
    subTitle: string
  }
}

interface ChatPromotionContent {
  type: ChatContentType.PROMOTION
  content: {
    url: string,
    coverUrl: string,
    title: string,
    subTitle: string
  }
}

interface ChatVideoContent {
  type: ChatContentType.VIDEO
  content: Video
}

interface ChatAlbumContent {
  type: ChatContentType.ALBUM
  content: Album
}

interface ChatMVContent {
  type: ChatContentType.MV
  content: MV
}

interface ChatTextContent {
  type: ChatContentType.TEXT
  content: string
}

interface ChatPlaylistContent {
  type: ChatContentType.PLAYLIST
  content: PlaylistClass
}

type ChatContent = 
  ChatAlbumContent | 
  ChatMVContent | 
  ChatTextContent | 
  ChatPlaylistContent |
  ChatGeneralContent |
  ChatPromotionContent |
  ChatVideoContent

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
    console.log(content)
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
    case ChatContentType.MV:
      content = createMV(data.mv)
      break
    case ChatContentType.PLAYLIST:
      content = new PlaylistClass(data.playlist)
      break
    case ChatContentType.GENERAL:
      content = data.generalMsg
      break
    case ChatContentType.PROMOTION:
      content = data.promotionUrl
      break
    case ChatContentType.TEXT:
    default:
      content = null
      break
  }
  return { content, type }
}

export function createChatList (data: any[]) {
  return data.map(item => new Chat(item))
}