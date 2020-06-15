import axios from '../request'

interface GetArtistParam {
  limit: number
  offset: number
  initial: string | number
  type: number
  area: number
}

interface ArtistIdParam {
  id: number
  limit?: number
  offset?: number
}

export default {
  getArtist (params: GetArtistParam) {
    return axios.get('artist/list', { params })
  },
  getArtistDetail (params: ArtistIdParam) {
    return axios.get('artists', { params })
  },
  getArtistAlbum (params: ArtistIdParam) {
    return axios.get('artist/album', { params })
  },
  getArtistDesc (params: ArtistIdParam) {
    return axios.get('artist/desc', { params })
  },
  getArtistSimi (params: ArtistIdParam) {
    return axios.get('simi/artist', { params })
  },
  getArtistMV (params: ArtistIdParam) {
    return axios.get('artist/mv', { params })
  },
  artistSub (params: { t: number, id: number }) {
    return axios.get('artist/sub', { params, needLogin: true })
  },
  getUserCollectArtist (params: { limit: number, offset: number }) {
    return axios.get('artist/sublist', { params })
  }
}