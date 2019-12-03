import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const Home: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <>{renderRoutes(route!.routes)}</>
  )
}

export default Home 