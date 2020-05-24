import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './router'
import { setGlobalCSSVar } from 'UTIL/css-var'
import { refresh } from 'UTIL/login'
import { Provider } from 'react-redux'
import configureStore from './store/index'

const store = configureStore()

refresh()
setGlobalCSSVar('light')

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      {renderRoutes(routes)}
    </Provider>
  </BrowserRouter>,
document.getElementById('app'))