import axios from 'axios'
import { checkLoginStatus } from 'UTIL/account'
import { openLoginDialog } from 'COMPONENTS/dialog/login/login-dialog'

declare module 'axios' {
  interface AxiosRequestConfig {
    needLogin?: boolean
  }
}

const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.cancelToken = source.token
axios.defaults.withCredentials = true

axios.interceptors.request.use((config) => {
  if (config.needLogin && !checkLoginStatus()) {
    openLoginDialog()
    source.cancel()
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
  return Promise.reject(error.response)
})

export default axios