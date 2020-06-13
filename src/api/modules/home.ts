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
  getRecommendwMV () {
    return axios.get('personalized/mv', { params: { limit: 4 }, withCredentials: true })
  },
  getRecomendNewSong () {
    return axios.get('personalized/newsong')
  },
  getTopList (params: any) {
    return axios.get('top/playlist', { params })
  },
  getRecomendDj () {
    return axios.get('personalized/djprogram')
  },
  getRecomendSong () {
    return axios.get('recommend/songs')
  }
}