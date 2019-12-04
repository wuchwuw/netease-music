import axios from '../request'

export default {
  getPlaylist (params: any) {
    return axios.get('playlist/detail', { params })
  }
}