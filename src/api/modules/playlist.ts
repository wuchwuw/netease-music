import axios from '../request'

interface PlaylistIdProps {
  id: number
}

interface addPlaylistProps {
  name: string
  privacy: number | string
}

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
  },
  addPlaylist (params: addPlaylistProps) {
    return axios.get('playlist/create', { params, withCredentials: true })
  },
  deletePlaylist (params: PlaylistIdProps) {
    return axios.get('playlist/delete', { params, withCredentials: true })
  },
  addOrRemoveSong (params: { op: 'add' | 'del', pid: number, tracks: number }) {
    return axios.get('playlist/tracks', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  }
}