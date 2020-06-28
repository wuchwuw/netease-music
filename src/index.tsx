import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { initGlobalCSSVar } from 'UTIL/css-var'
import { refresh } from 'UTIL/account'
import { Provider } from 'react-redux'
import { store } from './store/index'
import App from './app'

refresh()
initGlobalCSSVar()

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App></App>
    </Provider>
  </BrowserRouter>,
document.getElementById('app'))