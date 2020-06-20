import { Redirect, Route } from 'react-router'
import React from 'react'

export function createRedirect (path: string): React.SFC {
  return () => <Redirect to={path}></Redirect>
}

export function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => (
        // pass the sub-routes down to keep nesting
        <route.component {...props} routes={route.routes} />
      )}
    />
  )
}