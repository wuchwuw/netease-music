import axios from '../request'

interface GetArtistParam {
  limit: number
  offset: number
  initial: string | number
  cat: string | number
}

export default {
  getArtist (params: GetArtistParam) {
    return axios.get('artist/list', { params })
  }
}