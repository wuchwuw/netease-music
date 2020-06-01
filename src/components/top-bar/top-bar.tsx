import React from 'react'
import './top-bar.less'
import { NavLink, withRouter, useLocation } from 'react-router-dom'
import { RootState } from 'STORE/index'
import { useSelector, useDispatch } from 'react-redux'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import { SET_PANEL_TYPE } from 'STORE/commen/types'
import classnames from 'classnames'
import { usePanelContaienr, PanelType } from 'VIEWS/panel/container'
import { useContainer } from 'COMPONENTS/container/container'
import { usePageForword } from 'ROUTER/hooks'
import { setGlobalCSSVar } from 'UTIL/css-var'
import { useSearchKeywords } from 'UTIL/search-keywords'

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
  const location = useLocation()
  const { visiable, open } = useContainer(['#style-mode'])
  const { goSearch } = usePageForword()
  const { keywords, setKeywords, addKeywordsHistory } = useSearchKeywords()

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
    // todo usePanelContaienr
    dispatch({ type: SET_PANEL_TYPE, panelType: 'search' })
  }

  function onSearchChange (value: string) {
    // todo 节流
    // if panel close set search
    setKeywords(value)
  }

  function onSearchKeyup (e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.keyCode === 13) {
      goSearch({ keywords, tab: 'song' })
      addKeywordsHistory(keywords)
      dispatch({ type: SET_PANEL_TYPE, panelType: 'close' })
    }
  }

  function onSearchClear (e: React.MouseEvent) {
    e.nativeEvent.stopImmediatePropagation();
    setKeywords('')
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
          <input
            onChange={(e) => onSearchChange(e.target.value) }
            onKeyUp={(e) => onSearchKeyup(e)}
            onFocus={() => onSearchFocus() }
            type="text"
            placeholder="搜索"
            value={keywords}
          />
          { !!keywords && <i onClick={(e) => { onSearchClear(e) }} className="iconfont icon-close"></i> }
        </div>
      </div>
      <div className="topbar-other">
        <i className="iconfont icon-setting"></i>
        <i id="message-icon" onClick={() => { setPanelType(PanelType.Message) }} className={classnames('iconfont icon-email', {'active': currentPanelType === PanelType.Message})}></i>
        <i id="style-mode" className={classnames('iconfont icon-style', { 'active': visiable })} onClick={() => { open() }}>
          {
            visiable &&
            <div className="style-mode-wrap">
              <div className="style-mode-item"><div className="style-mode-light active" onClick={() => { setGlobalCSSVar('light') }}></div><span>浅色</span></div>
              <div className="style-mode-item"><div className="style-mode-red active"></div><span>红色</span></div>
              <div className="style-mode-item"><div className="style-mode-dark active"  onClick={() => { setGlobalCSSVar('dark') }}></div><span>深色</span></div>
            </div>
          }
        </i>
      </div>
    </div>
  )
}

export default withRouter(TopBar)