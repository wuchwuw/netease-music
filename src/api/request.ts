import axios from 'axios'
import { checkLoginStatus } from 'UTIL/login'
import { loginDialog } from 'COMPONENTS/dialog/create'
import configureStore from 'STORE/index'
const CancelToken = axios.CancelToken
const source = CancelToken.source()

axios.defaults.baseURL = 'http://localhost:3000/'
axios.defaults.cancelToken = source.token

axios.interceptors.request.use((config) => {
  const store = configureStore()
  store.getState().user.isLogin = false
  if (config.needLogin && !checkLoginStatus()) {
    loginDialog.open()
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