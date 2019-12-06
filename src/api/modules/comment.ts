import axios from '../request'

export default {
  getHotComment (params: any) {
    return axios.get('comment/hot', { params })
  },
  getPlaylistComment (params: any) {
    return axios.get('comment/playlist', { params })
  }
}