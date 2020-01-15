import axios from '../request'

export default {
  getPlaylist (params: any) {
    return axios.get('playlist/detail', { params })
  },
  getPlaylistHotCate () {
    return axios.get('playlist/hot')
  },
  getPlaylistHighquality (params: any) {
    return axios.get('top/playlist/highquality', { params })
  },
  getToplist () {
    return axios.get('toplist/detail')
  },
  getToplistIndex (params: any) {
    return axios.get('top/list', { params })
  }
}