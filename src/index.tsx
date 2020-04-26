import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './router'
import { setGlobalCSSVar } from 'UTIL/css-var'
import { refresh } from 'UTIL/login'

refresh()
setGlobalCSSVar('light')

ReactDOM.render(
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>,
document.getElementById('app'))