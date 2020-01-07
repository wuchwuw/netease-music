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
  getSearchSuggest () {
    return axios.get('search/suggest')
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
  }
}