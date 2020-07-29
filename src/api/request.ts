import axios from 'axios'
import { checkLoginStatus } from 'UTIL/account'
import { openLoginDialog } from 'COMPONENTS/dialog/login/login-dialog'

declare module 'axios' {
  interface AxiosRequestConfig {
    needLogin?: boolean
  }
}

const CancelToken = axios.CancelToken
let source = CancelToken.source()

function updataCancelToken () {
  source = CancelToken.source()
  axios.defaults.cancelToken = source.token
}

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.cancelToken = source.token
axios.defaults.withCredentials = true
axios.defaults.timeout = 6000

axios.interceptors.request.use((config) => {
  if (config.needLogin && !checkLoginStatus()) {
    openLoginDialog()
    source.cancel()
    updataCancelToken()
  }
  if (!config.params) {
    config.params = {}
  }
  config.params.timestamp = +new Date()
  return config
}, (err) => {
  console.log(err)
})

axios.interceptors.response.use((response) => {
  return response
}, (error) => {
  console.log(error)
  return Promise.reject(error.response)
})

export default axios