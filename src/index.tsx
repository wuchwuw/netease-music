import React from 'react'
import ReactDOM from 'react-dom'
import './style/index.less'
import { BrowserRouter } from 'react-router-dom'
import { initGlobalCSSVar } from 'UTIL/css-var'
import { refresh } from 'UTIL/account'
import { Provider } from 'react-redux'
import { store } from './store/index'
import App from './app'
import * as Sentry from '@sentry/react'
import { Integrations } from '@sentry/tracing'


process.env.NODE_ENV === 'production' && Sentry.init({
  dsn: "https://259553fbff314bb4b2ed6d8d68a3347a@o474428.ingest.sentry.io/5510698",
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
})

let root = process.env.NODE_ENV === 'production' ?
<Sentry.ErrorBoundary>
  <BrowserRouter>
    <Provider store={store}>
      <App></App>
    </Provider>
  </BrowserRouter>
</Sentry.ErrorBoundary>
:
<BrowserRouter>
  <Provider store={store}>
    <App></App>
  </Provider>
</BrowserRouter>

refresh()
initGlobalCSSVar()

ReactDOM.render(root, document.getElementById('app'))