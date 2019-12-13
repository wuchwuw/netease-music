import axios from '../request'

export default {
  getBanner () {
    return axios.get('banner')
  },
  getPersonalized () {
    return axios.get('personalized')
  },
  getPrivatecontent () {
    return axios.get('personalized/privatecontent')
  },
  getNewMv () {
    return axios.get('mv/first', { params: { limit: 10 } })
  },
  getNewSong () {
    return axios.get('personalized/newsong')
  },
  getTopList () {
    return axios.get('top/playlist', { params: { limit: 10, order: 'hot' }})
  },
  getSongUrl (params: any) {
    return axios.get('song/url', { params })
  }
}