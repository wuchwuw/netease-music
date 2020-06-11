import axios from '../request'

interface PlaylistIdProps {
  id: number
}

interface addPlaylistProps {
  name: string
  privacy: number | string
}

export default {
  getPlaylist (params: { id: number }) {
    return axios.get('playlist/detail', { params })
  },
  getPlaylistAllCate () {
    return axios.get('/playlist/catlist')
  },
  getPlaylistHotCate () {
    return axios.get('playlist/hot')
  },
  getPlaylistHighquality (params: { cat: string, limit: number }) {
    return axios.get('top/playlist/highquality', { params })
  },
  getToplist () {
    return axios.get('toplist/detail')
  },
  getToplistIndex (params: any) {
    return axios.get('top/list', { params })
  },
  getPlaylistSubscribers (params: { id: number, limit: number, offset: number }) {
    return axios.get('playlist/subscribers', { params })
  },
  playlistSubscribers (params: { t: number, id: number }) {
    return axios.get('playlist/subscribe', { params })
  },
  addPlaylist (params: addPlaylistProps) {
    return axios.get('playlist/create', { params })
  },
  deletePlaylist (params: PlaylistIdProps) {
    return axios.get('playlist/delete', { params })
  },
  addOrRemoveSong (params: { op: 'add' | 'del', pid: number, tracks: number }) {
    return axios.get('playlist/tracks', { params })
  },
  updatePlaylistInfo (params: { id: number, name: string, tags: string, desc: string }) {
    return axios.get('playlist/update', { params })
  }
}