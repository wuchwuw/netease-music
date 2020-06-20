import React, { useEffect, useState } from 'react'
import LeftBar from 'COMPONENTS/left-bar/left-bar'
import TopBar from 'COMPONENTS/top-bar/top-bar'
import Player from 'VIEWS/player/player'
import PanelContainer from 'VIEWS/panel/container'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import ScrollToTop from 'COMPONENTS/scroll-to-top/scroll-to-top'
import { useAccountInit } from 'UTIL/account'
import { useHistory, Prompt } from 'react-router'
import routes from './router'
import { RouteWithSubRoutes } from 'ROUTER/redirect'
import {
  Switch,
  Route,
  Link
} from 'react-router-dom'

const App = () => {
  const { initAccount } = useAccountInit()
  useEffect(() => {
    initAccount()
  }, [])

  return (
    <div className="appwrap">
      <div className="top"><TopBar/></div>
      <div className="main">
        <div className="main-left">
          <LeftBar></LeftBar>
        </div>
        <div className="main-right">
          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} />
            ))}
          </Switch>
        </div>
      </div>
      <div className="bottom"><Player></Player></div>
      {/* <Prompt message={(l) => { console.log(l); return false;}}></Prompt> */}
      <PanelContainer></PanelContainer>
      <ScrollToTop></ScrollToTop>
    </div>
  )
}

export default App