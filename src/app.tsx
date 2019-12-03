import React, { useState } from 'react'
import LeftBar from './compontens/left-bar/left-bar'
import TopBar from './compontens/top-bar/top-bar'
import Player from './compontens/player/player'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const App: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  const [currentTab, setCuttentTab] = useState('index')
  return (
    <div className="appwrap">
      <div className="top"><TopBar currentTab={currentTab}/></div>
      <div className="main">
        <div className="main-left"><LeftBar setTab={setCuttentTab}></LeftBar></div>
        <div className="main-right">
          {renderRoutes(route!.routes)}
        </div>
      </div>
      <div className="bottom"><Player></Player></div>
    </div>
  )
}

export default App