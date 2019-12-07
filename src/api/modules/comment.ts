import axios from '../request'

export default {
  getHotComment (params: any) {
    return axios.get('comment/hot', { params })
  },
  getComment (params: any) {
    return axios.get(`comment/${params.type}`, { params: params.params })
  }
}