import axios from '../request'

interface AlbumIDParams {
  id: number
}

export default {
  getAlbumContent (params: AlbumIDParams) {
    return axios.get('album', { params, withCredentials: true })
  },
  getUserCollectAlbum (params: { limit: number, offset: number }) {
    return axios.get('album', { params })
  }
}