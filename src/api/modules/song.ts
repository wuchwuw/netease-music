import axios from '../request'

export default {
  getLyric (id) {
    return axios.get('lyric', { params: { id } })
  },
  getSongUrl (params: any) {
    return axios.get('song/url', { params })
  },
  getNewSong (params: any) {
    return axios.get('top/song', { params })
  },
  getNewAlbum (params: any) {
    return axios.get('top/album', { params })
  },
  like (params: any) {
    return axios.get('like', { params })
  },
  getSongDetail (params: { ids: number[] }) {
    return axios.get('song/detail', { params: { ids: params.ids.join(',') } })
  }
}