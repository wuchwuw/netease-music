import axios from '../request'

export default {
  getActivity (params: any) {
    return axios.get('event', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  },
  getHotTopic (params: any) {
    return axios.get('hot/topic', { params: { ...params, timestamp: +new Date() }, withCredentials: true })
  }
}