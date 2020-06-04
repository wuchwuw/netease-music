import axios from '../request'

interface loginParams {
  phone: string
  password: string
}

interface UserIdParams {
  uid: number
}

export default {
  login (params: loginParams) {
    return axios.get('login/cellphone', { params })
  },
  refreshLogin () {
    return axios.get('login/refresh')
  },
  getUserPlaylist (params: UserIdParams) {
    return axios.get('user/playlist', { params })
  },
  getUserInfo () {
    return axios.get('user/subcount')
  },
  getUserDetail (params: UserIdParams) {
    return axios.get('/user/detail', { params })
  },
  getUserLikelist (params: UserIdParams) {
    return axios.get('/likelist', { params })
  },
  getFM () {
    return axios.get('/personal_fm')
  },
  addFMTrash (params: { id: number }) {
    return axios.get('/fm_trash', { params })
  },
  userFollow (params: { id: number, t: number }) {
    return axios.get('/follow', { params })
  },
  getUserCloud (params: { limit: number, offset: number }) {
    return axios.get('user/cloud', { params })
  }
}