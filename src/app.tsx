import React, { useEffect, useState } from 'react'
import LeftBar from 'COMPONENTS/left-bar/left-bar'
import TopBar from 'COMPONENTS/top-bar/top-bar'
import Player from 'VIEWS/player/player'
import PanelContainer from 'VIEWS/panel/container'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import ScrollToTop from 'COMPONENTS/scroll-to-top/scroll-to-top'
import { useAccountInit } from 'UTIL/account'
import { useHistory, Prompt } from 'react-router'

const App: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  const { initAccount } = useAccountInit()
  const history = useHistory()
  const [aa, setAa] = useState(false)
  useEffect(() => {
    initAccount()
    // history.listen(l => {
    //   setAa(true)
    // })
  }, [])

  return (
    <div className="appwrap">
      <div className="top"><TopBar/></div>
      <div className="main">
        <div className="main-left">
          <LeftBar></LeftBar>
        </div>
        <div className="main-right">
          {renderRoutes(route!.routes)}
        </div>
        <Prompt message={(l) => { console.log(l); return false;}}></Prompt>
      </div>
      <div className="bottom"><Player></Player></div>
      <PanelContainer></PanelContainer>
      <ScrollToTop></ScrollToTop>
    </div>
  )
}

export default App