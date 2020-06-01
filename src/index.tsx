import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './router'
import { setGlobalCSSVar } from 'UTIL/css-var'
import { refresh } from 'UTIL/account'
import { Provider } from 'react-redux'
import { store } from './store/index'

refresh()
setGlobalCSSVar('light')

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      {renderRoutes(routes)}
    </Provider>
  </BrowserRouter>,
document.getElementById('app'))