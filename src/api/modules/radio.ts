import axios from '../request'

export default {
  getRadioBanner () {
    return axios.get('dj/banner')
  }
}