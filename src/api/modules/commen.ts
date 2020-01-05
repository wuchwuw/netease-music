import axios from '../request'

interface GetPanelMessageParams {
  limit: number
}

export default {
  getSimi (params: any) {
    return axios.get(`simi/${params.type}`, { params: params.query, withCredentials: true })
  },
  getHotKeyword () {
    return axios.get('search/hot')
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