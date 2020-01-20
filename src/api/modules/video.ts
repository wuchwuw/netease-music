import axios from '../request'

export default {
  getVideoTags () {
    return axios.get('video/group/list')
  },
  getViodeList (params: any) {
    return axios.get('video/group/list', { params })
  }
}