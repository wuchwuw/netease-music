import axios from '../request'

export default {
  getSimi (params: any) {
    return axios.get(`simi/${params.type}`, { params: params.query })
  },
  getHotKeyword () {
    return axios.get('search/hot')
  },
  getSearchDefaultKeyword () {
    return axios.get('search/default')
  },
  getSearchSuggest (params: any) {
    return axios.get('search/suggest', { params })
  },
  getSearchMultimatch () {
    return axios.get('search/multimatch')
  },
  search (params: { keywords: string, type?: number, limit: number }) {
    return axios.get('search', { params })
  },
  getPanelMessage (params: { limit: number, offset: number }) {
    return axios.get('msg/private', { params })
  },
  getPanelComments (params: { limit: number, before: number, uid: number }) {
    return axios.get('msg/comments', { params })
  },
  getPanelForwards (params: { limit: number, offset: number }) {
    return axios.get('msg/forwards', { params })
  },
  getPanelNotices (params: { limit: number, lasttime: number }) {
    return axios.get('msg/notices', { params })
  },
  getPrivateMessage (params: { uid: number, limit: number}) {
    return axios.get('msg/private/history', { params })
  },
  sendTextMessage (params: { user_ids: number[], msg: string }) {
    return axios.get('send/text', { params })
  },
  sendPlaylistMessage (params: { user_ids: number[], msg: string, playlist: number }) {
    return axios.get('send/text', { params })
  },
  likeResource (params: { t: number, type: number, id?: number | string, threadId?: string}) {
    return axios.get('resource/like', { params })
  }
}