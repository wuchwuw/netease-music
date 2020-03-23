import axios from '../request'

export default {
  getPlaylist (params: any) {
    return axios.get('playlist/detail', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
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
  },
  getPlaylistSubscribers (params: any) {
    return axios.get('playlist/subscribers', { params })
  },
  playlistSubscribers (params: any) {
    return axios.get('playlist/subscribe', { params, withCredentials: true })
  }
}