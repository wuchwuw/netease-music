import React from 'react'
import { RouteWithSubRoutes } from 'ROUTER/redirect'
import PageTitle from 'COMPONENTS/page-title/page-title'
import { NavLink } from 'react-router-dom'

const homeSubPagePathMap = {
  '/home/index': '个性推荐',
  '/home/playlist': '歌单',
  // '/home/radio': '主播电台',
  '/home/toplist': '排行榜',
  '/home/artist': '歌手',
  '/home/new': '最新音乐'
}

const Home = ({ routes }) => {
  return (
    <>
      <PageTitle>
        {
          (Object.keys(homeSubPagePathMap) as Array<keyof typeof homeSubPagePathMap>).map((key) => (
            <NavLink
              to={key}
              activeClassName="active"
              className="topbar-content-item"
              key={key}
            >
              {homeSubPagePathMap[key]}
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

export default Home