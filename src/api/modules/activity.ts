import axios from '../request'

export default {
  getActivity (params: any) {
    return axios.get('event', { params })
  },
  getHotTopic (params: any) {
    return axios.get('hot/topic', { params })
  },
  share (params: { type: string, id: number | string, msg: string}) {
    return axios.get('share/resource', { params })
  },
  forward (params: { evId: number, uid: number, forwards: string }) {
    return axios.get('event/forward', { params })
  }
}