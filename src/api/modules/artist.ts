import axios from '../request'

interface GetArtistParam {
  limit: number
  offset: number
  initial: string | number
  cat: string | number
}

interface ArtistIdParam {
  id: number
  limit?: number
}

export default {
  getArtist (params: GetArtistParam) {
    return axios.get('artist/list', { params })
  },
  getArtistDetail (params: ArtistIdParam) {
    return axios.get('artists', { params, withCredentials: true })
  },
  getArtistAlbum (params: ArtistIdParam) {
    return axios.get('artist/album', { params })
  },
  getArtistDesc (params: ArtistIdParam) {
    return axios.get('artist/desc', { params })
  },
  getArtistSimi (params: ArtistIdParam) {
    return axios.get('simi/artist', { params })
  }
}