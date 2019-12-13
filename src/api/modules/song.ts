import axios from '../request'

export default {
  getLyric (id) {
    return axios.get('lyric', { params: { id } })
  }
}