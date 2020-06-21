import { Redirect, Route } from 'react-router'
import React from 'react'
import { checkLoginStatus } from 'UTIL/account'
import { openLoginDialog } from 'COMPONENTS/dialog/login/login-dialog'

export function createRedirect (path: string): React.SFC {
  return () => <Redirect to={path}></Redirect>
}

export function RouteWithSubRoutes(route) {
  return (
    <Route
      path={route.path}
      render={props => {
        if (route.needLogin && !checkLoginStatus()) {
          openLoginDialog()
          return <Redirect to={{
            pathname: '/home/index'
          }}></Redirect>
        }
        return <route.component {...props} routes={route.routes} />
      }}
    />
  )
}