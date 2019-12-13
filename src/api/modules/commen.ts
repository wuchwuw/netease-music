import axios from '../request'

export default {
  getSimi (params: any) {
    return axios.get(`simi/${params.type}`, { params: params.query })
  }
}