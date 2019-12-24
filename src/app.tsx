import React, { useState } from 'react'
import LeftBar from './components/left-bar/left-bar'
import TopBar from './components/top-bar/top-bar'
import Player from './components/player/player'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { Provider } from 'react-redux'
import configureStore from './store/index'

const store = configureStore()

const App: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <Provider store={store}>
      <div className="appwrap">
        <div className="top"><TopBar/></div>
        <div className="main">
          <div className="main-left"><LeftBar></LeftBar></div>
          <div className="main-right">
            {renderRoutes(route!.routes)}
          </div>
        </div>
        <div className="bottom"><Player></Player></div>
      </div>
    </Provider>
  )
}

export default App