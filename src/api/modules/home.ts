import axios from '../request'

export default {
  getBanner () {
    return axios.get('banner')
  },
  getPersonalized () {
    return axios.get('personalized', { withCredentials: true })
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
  getTopList (params: any) {
    return axios.get('top/playlist', { params })
  },
  getRecomendDj () {
    return axios.get('personalized/djprogram')
  }
}