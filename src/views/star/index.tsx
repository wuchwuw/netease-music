import React from 'react'
import { RouteWithSubRoutes } from 'ROUTER/redirect'
import PageTitle from 'COMPONENTS/page-title/page-title'
import { NavLink } from 'react-router-dom'

const starSubPagePathMap = {
  '/star/album': '专辑',
  '/star/artist': '歌手',
  '/star/video': '视频',
}

const StarContainer = ({ routes }) => {
  return (
    <>
      <PageTitle>
        {
          (Object.keys(starSubPagePathMap) as Array<keyof typeof starSubPagePathMap>).map((key) => (
            <NavLink
              to={key}
              activeClassName="active"
              className="topbar-content-item"
              key={key}
            >
              {starSubPagePathMap[key]}
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

export default StarContainer