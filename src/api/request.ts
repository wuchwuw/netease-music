import axios from 'axios'
import { checkLoginStatus } from 'UTIL/login'
import { openLoginDialog } from 'COMPONENTS/dialog/login/login-dialog'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.cancelToken = source.token
axios.defaults.withCredentials = true

axios.interceptors.request.use((config) => {
  // const store = configureStore()
  // store.getState().user.isLogin = false
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

export default axios