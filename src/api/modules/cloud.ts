import axios from '../request'

export default {
  getUserCloud (params: any) {
    return axios.get('/user/cloud', { params })
  }
}