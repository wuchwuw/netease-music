import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './router'

ReactDOM.render(
  <BrowserRouter>
    {renderRoutes(routes)}
  </BrowserRouter>,
document.getElementById('app'))