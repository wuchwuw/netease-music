import React from 'react'
import { RouteWithSubRoutes } from 'ROUTER/redirect'

const Home = ({ routes }) => {
  console.log(routes)
  return (
    <>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </>
  )
}

export default Home