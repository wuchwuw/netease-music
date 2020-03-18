import React from 'react'
import './top-bar.less'
import { NavLink, withRouter, useLocation } from 'react-router-dom'
import { RootState } from 'STORE/index'
import { useSelector, useDispatch } from 'react-redux'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import { SET_PANEL_TYPE } from 'STORE/commen/types'
import classnames from 'classnames'
import { usePanelContaienr, PanelType } from 'VIEWS/panel/container'

const homeSubPagePathMap: any = {
  '/home/index': '个性推荐',
  '/home/album': '歌单',
  '/home/radio': '主播电台',
  '/home/toplist': '排行榜',
  '/home/artist': '歌手',
  '/home/new': '最新音乐'
}

const viodeSubPagePathMap: any = {
  '/video/index': '视频',
  '/video/mv': 'MV'
}

const TopBar: React.SFC = () => {
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const dispatch = useDispatch()
  const { setPanelType, currentPanelType } = usePanelContaienr()
  const location = useLocation();

  function renderTopbarContent () {
    let routePath = {}
    if (/playlist/.test(location.pathname) || fullScreen) {
      return <></>
    }
    if (/activity/.test(location.pathname)) {
      return (
        <div>
          <span className="topbar-content-item active">动态</span>
          <span className="topbar-activity-btn">发动态</span>
        </div>
      )
    }
    if (/home/.test(location.pathname)) {
      routePath = homeSubPagePathMap
    } else if (/video/.test(location.pathname)) {
      routePath = viodeSubPagePathMap
    }
    return (
      <>
        {
          (Object.keys(routePath) as Array<keyof typeof routePath>).map((key) => (
            <NavLink
              to={key}
              activeClassName="active"
              className="topbar-content-item"
              key={key}
            >
                {routePath[key]}
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
        <i id="message-icon" onClick={() => { setPanelType(PanelType.Message) }} className={classnames('iconfont icon-email', {'active': currentPanelType === PanelType.Message})}></i>
        <i className="iconfont icon-style"></i>
      </div>
    </div>
  )
}

export default withRouter(TopBar)