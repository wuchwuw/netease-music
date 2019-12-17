import React from 'react'
import './top-bar.less'
import { NavLink } from 'react-router-dom'

const homeSubPagePathMap: any = {
  '/home/index': '个性推荐',
  '/home/album': '歌单',
  '/home/radio': '主播电台',
  '/home/rank': '排行榜',
  '/home/singer': '歌手',
  '/home/song': '最新音乐'
}

const TopBar: React.SFC = (props) => {
  function renderTopbarContent () {
    return (
      <>
        {
          Object.keys(homeSubPagePathMap).map((key: any, index: any) => (
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
      </>
    )
  }
  return (
    <div className="topbar-wrap">
      <div className="topbar-arrow">
        <div className="topbar-arrow-wrap">
          <i className="iconfont icon-arrow topbar-arrow-left"></i>
          <i className="iconfont icon-arrow"></i>
        </div>
      </div>
      <div className="topbar-content">{renderTopbarContent()}</div>
      <div className="topbar-search">
        <div className="topbar-search-content">
          <i className="iconfont icon-search"></i>
          <input type="text" placeholder="搜索"/>
        </div>
      </div>
      <div className="topbar-other">
        <i className="iconfont icon-setting"></i>
        <i className="iconfont icon-email"></i>
        <i className="iconfont icon-style"></i>
      </div>
    </div>
  )
}

export default TopBar