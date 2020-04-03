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
    return axios.get('login/cellphone', { params: params, withCredentials: true })
  },
  getUserPlaylist (params: UserIdParams) {
    return axios.get('user/playlist', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  },
  getUserInfo () {
    return axios.get('user/subcount', { withCredentials: true })
  },
  getFM () {
    // params: { timestamp: +new Date() },
    return axios.get('/personal_fm', { params: { timestamp: +new Date(), limit: 10 }, withCredentials: true })
  },
  getUserDetail (params: UserIdParams) {
    return axios.get('/user/detail', { params, withCredentials: true })
  },
  getUserLikelist (params: UserIdParams) {
    return axios.get('/likelist', { params })
  }
}