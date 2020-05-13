import React, { useEffect } from 'react'
import LeftBar from 'COMPONENTS/left-bar/left-bar'
import TopBar from 'COMPONENTS/top-bar/top-bar'
import Player from 'VIEWS/player/player'
import PanelContainer from 'VIEWS/panel/container'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { useFavorite } from 'UTIL/favorite'
import { useUserPlaylist } from 'UTIL/user-playlist'

const App: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  const { getFavoriteIds } = useFavorite()
  const { getUserPlaylist } = useUserPlaylist()

  useEffect(() => {
    getFavoriteIds(98931610)
    getUserPlaylist()
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
      </div>
      <div className="bottom"><Player></Player></div>
      <PanelContainer></PanelContainer>
    </div>
  )
}

export default App