
import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const VideoContainer: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <>{renderRoutes(route!.routes)}</>
  )
}

export default VideoContainer 