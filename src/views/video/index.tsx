
import React from 'react'
import { RouteWithSubRoutes } from 'ROUTER/redirect'
import PageTitle from 'COMPONENTS/page-title/page-title'
import { NavLink } from 'react-router-dom'

const viodeSubPagePathMap = {
  '/video/index': '视频',
  '/video/mv': 'MV'
}

const VideoContainer = ({ routes }) => {
  return (
    <>
      <PageTitle>
        {
          (Object.keys(viodeSubPagePathMap) as Array<keyof typeof viodeSubPagePathMap>).map((key) => (
            <NavLink
              to={key}
              activeClassName="active"
              className="topbar-content-item"
              key={key}
            >
              {viodeSubPagePathMap[key]}
            </NavLink>
          ))
        }
      </PageTitle>
      {routes.map((route, i) => (
        <RouteWithSubRoutes key={i} {...route} />
      ))}
    </>
  )
}

export default VideoContainer