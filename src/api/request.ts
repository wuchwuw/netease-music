import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3000/'

axios.interceptors.request.use((config) => {
  if (!config.params) {
    config.params = {}
  }
  config.params.timestamp = +new Date()
  return config
}, (err) => {
  console.log(err)
})

export default axios