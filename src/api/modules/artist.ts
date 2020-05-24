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
  offset?: number
}

export default {
  getArtist (params: GetArtistParam) {
    return axios.get('artist/list', { params , withCredentials: true })
  },
  getArtistDetail (params: ArtistIdParam) {
    return axios.get('artists', { params , withCredentials: true })
  },
  getArtistAlbum (params: ArtistIdParam) {
    return axios.get('artist/album', { params , withCredentials: true })
  },
  getArtistDesc (params: ArtistIdParam) {
    return axios.get('artist/desc', { params })
  },
  getArtistSimi (params: ArtistIdParam) {
    return axios.get('simi/artist', { params, withCredentials: true })
  },
  getArtistMV (params: ArtistIdParam) {
    return axios.get('artist/mv', { params })
  },
  artistSub (params: { t: number, id: number }) {
    return axios.get('artist/sub', { params , withCredentials: true })
  }
}