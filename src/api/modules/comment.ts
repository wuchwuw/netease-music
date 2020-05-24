import axios from '../request'

interface SendCommentParams {
  t: number
  type: number
  content: string
  id?: number | string
  threadId?: string
  commentId?: number
}

interface CommentLikeParams {
  cid: number
  t: number
  type: number
}

export default {
  getHotComment (params: any) {
    return axios.get('comment/hot', { params, withCredentials: true })
  },
  getComment (params: any) {
    return axios.get(`comment/${params.type}`, {  params: { ...params.params, timestamp: +new Date() }, withCredentials: true })
  },
  sendComment (params: SendCommentParams) {
    return axios.get('/comment', {  params, withCredentials: true })
  },
  commentLike (params: CommentLikeParams) {
    return axios.get('/comment/like', {  params, withCredentials: true })
  }
}