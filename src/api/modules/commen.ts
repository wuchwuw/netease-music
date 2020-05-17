import axios from '../request'

interface GetPanelMessageParams {
  limit: number
}

interface SearchParams {
  keywords: string
  type?: number
  limit: number
}

export default {
  getSimi (params: any) {
    return axios.get(`simi/${params.type}`, { params: params.query, withCredentials: true })
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
  search (params: SearchParams) {
    return axios.get('search', { params })
  },
  getPanelMessage (params: GetPanelMessageParams) {
    return axios.get('msg/private', { params, withCredentials: true })
  },
  getPanelComments (params: GetPanelMessageParams) {
    return axios.get('msg/comments', { params, withCredentials: true })
  },
  getPanelForwards (params: GetPanelMessageParams) {
    return axios.get('msg/forwards', { params, withCredentials: true })
  },
  getPanelNotices (params: GetPanelMessageParams) {
    return axios.get('msg/notices', { params, withCredentials: true })
  },
  getPrivateMessage (params: { uid: number, limit: number}) {
    return axios.get('msg/private/history', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  },
  likeResource (params: { t: number, type: number, id?: number | string, threadId?: string}) {
    const type_map = {
      'mv': 1,
      'radio': 4,
      'video': 5,
      'activity': 6
    }
    return axios.get('resource/like', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  }
}