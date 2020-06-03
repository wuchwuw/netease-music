import React from 'react'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const StarContainer: React.SFC<RouteConfigComponentProps> = ({ route }) => {
  return (
    <>{renderRoutes(route!.routes)}</>
  )
}

export default StarContainer