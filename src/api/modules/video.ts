import axios from '../request'

export default {
  getVideoTags () {
    return axios.get('video/group/list')
  },
  getViodeList (params: any) {
    return axios.get('video/group', { params, withCredentials: true })
  },
  getAllMv (params: any) {
    return axios.get('mv/all', { params })
  },
  getExclusiveMv (params: any) {
    return axios.get('mv/exclusive/rcmd', { params })
  },
  getNewMv (params: any) {
    return axios.get('mv/first', { params })
  },
  getMvToplist (params: any) {
    return axios.get('top/mv', { params })
  },
  getMVDetail (params: any) {
    return axios.get('mv/detail', { params })
  },
  getVideoDetail (params: any) {
    return axios.get('video/detail', { params })
  },
  getRelatedVideo (params: any) {
    return axios.get('related/allvideo', { params })
  },
  getRelatedMV (params: any) {
    return axios.get('simi/mv', { params })
  },
  getVideoURL (params: { id: string }) {
    return axios.get('video/url', { params })
  },
  getMVURL (params: { id: number }) {
    return axios.get('mv/url', { params })
  },
  getMVInfo (params: { mvid: number }) {
    return axios.get('mv/detail/info', { params })
  },
  getMVSubList () {
    return axios.get('mv/sublist')
  },
  getAllVideo (params: { offset: number }) {
    return axios.get('video/timeline/all', { params })
  },
  getAllMV (params: { area: string, type: string, order: string, limit: number, offset: number }) {
    return axios.get('mv/all', { params })
  },
  subMV (params: { t: number, mvid: number }) {
    return axios.get('mv/sub', { params })
  },
  getVideoInfo (params: { vid: string }) {
    return axios.get('video/detail/info', { params })
  }
}