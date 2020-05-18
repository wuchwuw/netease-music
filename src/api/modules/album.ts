import axios from '../request'

interface AlbumIDParams {
  id: number
}

export default {
  getAlbumContent (params: AlbumIDParams) {
    return axios.get('album', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  }
}