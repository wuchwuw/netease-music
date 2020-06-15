import axios from '../request'

export default {
  getAlbumContent (params: { id: number }) {
    return axios.get('album', { params })
  },
  getUserCollectAlbum (params: { limit: number, offset: number }) {
    return axios.get('album/sublist', { params })
  },
  getAlbumDynamic (params: { id: number }) {
    return axios.get('album/detail/dynamic', { params })
  },
  subAlbum (params: { t: number, id: number }) {
    return axios.get('album/sub', { params, needLogin: true })
  }
}