import React from 'react'
import './top-bar.less'
import { NavLink, withRouter } from 'react-router-dom'
import { RootState } from 'STORE/index'
import { useSelector, useDispatch } from 'react-redux'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import { SET_PANEL_TYPE } from 'STORE/commen/types'

const homeSubPagePathMap: any = {
  '/home/index': '个性推荐',
  '/home/album': '歌单',
  '/home/radio': '主播电台',
  '/home/rank': '排行榜',
  '/home/singer': '歌手',
  '/home/song': '最新音乐'
}

const TopBar: React.SFC = (props) => {
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const dispatch = useDispatch()

  function renderTopbarContent () {
    if (/playlist/.test(props.location.pathname) || fullScreen) {
      return <></>
    }
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

  function onSearchFocus () {
    dispatch({ type: SET_PANEL_TYPE, panelType: 'search' })
  }

  return (
    <div className="topbar-wrap">
      <div className="topbar-arrow">
        {
          !fullScreen ?
            <div className="topbar-arrow-wrap left">
              <i className="iconfont icon-arrow topbar-arrow-left"></i>
              <i className="iconfont icon-arrow"></i>
            </div>
          :
            <div className="topbar-arrow-wrap right">
              <i onClick={() => { dispatch({type: PLAYER_FULL_SCREEN, fullScreen: false}) }} className="iconfont icon-arrow topbar-arrow-down"></i>
            </div>
        }
      </div>
      <div className="topbar-content">{renderTopbarContent()}</div>
      <div className="topbar-search">
        <div className="topbar-search-content">
          <i className="iconfont icon-search"></i>
          <input onFocus={() => onSearchFocus() } type="text" placeholder="搜索"/>
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

export default withRouter(TopBar)