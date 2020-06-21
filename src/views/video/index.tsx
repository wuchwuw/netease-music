
import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { RouteWithSubRoutes } from 'ROUTER/redirect'

const VideoContainer: React.SFC<RouteConfigComponentProps> = ({ routes }) => {
  return (
    <>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </>
  )
}

export default VideoContainer