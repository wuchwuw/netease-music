import React, { useEffect } from 'react'
import LeftBar from 'COMPONENTS/left-bar/left-bar'
import TopBar from 'COMPONENTS/top-bar/top-bar'
import Player from 'VIEWS/player/player'
import PanelContainer from 'VIEWS/panel/container'
import ScrollToTop from 'COMPONENTS/scroll-to-top/scroll-to-top'
import { useAccountInit } from 'UTIL/account'
import { useRouteMatch } from 'react-router'
import routes from './router'
import { RouteWithSubRoutes } from 'ROUTER/redirect'
import FullScreenPlayer from 'VIEWS/player/full-screen-player'
import {
  Switch
} from 'react-router-dom'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import { useSelector } from 'react-redux'
import { RootState } from './store/index'
import { LoginDialog } from 'COMPONENTS/dialog/index'

const App = () => {
  const math = useRouteMatch({
    path: ['/v/:id', '/m/:id']
  })
  const { initAccount } = useAccountInit()
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  useEffect(() => {
    initAccount()
  }, [])

  function inVideo () {
    return !!math
  }

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
      <CSSTransition in={fullScreen} timeout={500} unmountOnExit classNames="player-slider">
        <FullScreenPlayer></FullScreenPlayer>
      </CSSTransition>
      <div id="bottom" className={classnames('bottom', { 'hide': inVideo() })}><Player></Player></div>
      {/* <Prompt message={(l) => { console.log(l); return false;}}></Prompt> */}
      <PanelContainer></PanelContainer>
      <ScrollToTop></ScrollToTop>
      <LoginDialog></LoginDialog>
    </div>
  )
}

export default App