import axios from '../request'

export default {
  getLyric (params: { id: number }) {
    return axios.get('lyric', { params })
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
    return axios.get('like', { params, needLogin: true })
  },
  getSongDetail (params: { ids: number[] }) {
    return axios.get('song/detail', { params: { ids: params.ids.join(',') } })
  }
}