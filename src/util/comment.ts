
import User from './user'
import dayjs from 'dayjs'

interface CommentReplied {
  beRepliedCommentId: number
  content: string
  user: User
}

export default class Comment {
  commentId: number
  content: string
  liked: boolean
  likedCount: number
  parentCommentId: number
  time: number
  user: User
  replied: CommentReplied | null

  constructor ({ commentId, content, liked, likedCount, parentCommentId, time, user = {}, replied = [] }: any) {
    this.commentId = commentId
    this.content = content
    this.liked = liked
    this.likedCount = likedCount
    this.parentCommentId = parentCommentId
    this.time = time
    this.user = new User(user)
    this.replied = replied.length ? { 
      beRepliedCommentId: replied[0].beRepliedCommentId,
      content: replied[0].content,
      user: new User(replied[0].user)
     } : null
  }

  get timeFormat () {
    return this.time ? dayjs(this.time).format('YYYY年MM月DD日 HH:MM') : ''
  }
}

export function createCommentList (data: any): Comment[] {
  if (!data.length) {
    return [] as Comment[]
  }
  return data.map((item: any) => {
    return new Comment(item)
  })
}