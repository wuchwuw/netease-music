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
    return axios.get('comment/hot', { params })
  },
  getComment (params: any) {
    return axios.get(`comment/${params.type}`, {  params: params.params })
  },
  sendComment (params: SendCommentParams) {
    return axios.get('/comment', {  params, needLogin: true })
  },
  commentLike (params: { id: number | string, cid: number, t: number, type: number }) {
    return axios.get('/comment/like', {  params, withCredentials: true, needLogin: true })
  }
}