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
  }
}