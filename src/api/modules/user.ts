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
    return axios.get('login/cellphone', { params, withCredentials: true })
  },
  refreshLogin () {
    return axios.get('login/refresh',  { withCredentials: true })
  },
  getUserPlaylist (params: UserIdParams) {
    return axios.get('user/playlist', { params, withCredentials: true })
  },
  getUserInfo () {
    return axios.get('user/subcount', { withCredentials: true })
  },
  getUserDetail (params: UserIdParams) {
    return axios.get('/user/detail', { params, withCredentials: true })
  },
  getUserLikelist (params: UserIdParams) {
    return axios.get('/likelist', { params, withCredentials: true })
  },
  getUserCloud () {
    return axios.get('/user/cloud', { withCredentials: true })
  },
  getFM () {
    return axios.get('/personal_fm', { withCredentials: true })
  },
  addFMTrash (params: { id: number }) {
    return axios.get('/fm_trash', { params, withCredentials: true })
  },
  userFollow (params: { id: number, t: number }) {
    return axios.get('/follow', { params, withCredentials: true })
  }
}