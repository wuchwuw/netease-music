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
    return axios.get('login/cellphone', { params: params })
  },
  getUserPlaylist (params: UserIdParams) {
    return axios.get('user/playlist', { params: params, withCredentials: true })
  },
  getUserInfo () {
    return axios.get('user/subcount', { withCredentials: true })
  }
}