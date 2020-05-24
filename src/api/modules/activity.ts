import axios from '../request'

export default {
  getActivity (params: any) {
    return axios.get('event', { params, withCredentials: true })
  },
  getHotTopic (params: any) {
    return axios.get('hot/topic', { params, withCredentials: true })
  }
}