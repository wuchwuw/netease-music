import React, { useState } from 'react'
import './top-bar.less'
import { RootState } from 'STORE/index'
import { useSelector, useDispatch } from 'react-redux'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import { SET_PANEL_TYPE } from 'STORE/commen/types'
import classnames from 'classnames'
import { usePanelContaienr, PanelType } from 'VIEWS/panel/container'
import { useContainer } from 'COMPONENTS/container/container'
import { usePageForword } from 'ROUTER/hooks'
import { setGlobalCSSVar, defaultMode } from 'UTIL/css-var'
import { useSearchKeywords } from 'UTIL/search-keywords'
import Icon from 'COMPONENTS/icon/icon'

const TopBar: React.SFC = () => {
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const dispatch = useDispatch()
  const { setPanelType, currentPanelType } = usePanelContaienr()
  const { visible, open } = useContainer(['#style-mode'])
  const { goSearch } = usePageForword()
  const { keywords, setKeywords, addKeywordsHistory } = useSearchKeywords()
  const [mode, setMode] = useState(defaultMode)

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
    <div styleName="topbar-wrap">
      <div styleName="topbar-arrow">
        {
          !fullScreen ?
            <div styleName="topbar-arrow-wrap left">
              <i className="iconfont icon-arrow-left topbar-arrow-left"></i>
              <i className="iconfont icon-arrow-right"></i>
            </div>
          :
            <div styleName="topbar-arrow-wrap right">
              <i onClick={() => { dispatch({type: PLAYER_FULL_SCREEN, fullScreen: false}) }} className="iconfont icon-arrow-right" styleName="topbar-arrow-down"></i>
            </div>
        }
      </div>
      {/* <div styleName="topbar-content">{renderTopbarContent()}</div> */}
      <div styleName="topbar-search">
        <div id="topbar-search-content" styleName="topbar-search-content">
          <i className="iconfont icon-search"></i>
          <input
            onChange={(e) => onSearchChange(e.target.value) }
            onKeyUp={(e) => onSearchKeyup(e)}
            onFocus={() => onSearchFocus() }
            type="text"
            placeholder="搜索"
            value={keywords}
          />
          { !!keywords && <Icon onClick={(e) => { onSearchClear(e) }} name="icon-close"></Icon> }
        </div>
      </div>
      <div styleName="topbar-other">
        <i className="iconfont icon-setting"></i>
        <i id="message-icon" onClick={() => { setPanelType(PanelType.Message) }} className={classnames('iconfont icon-email', {'active': currentPanelType === PanelType.Message})}></i>
        <i id="style-mode" styleName="style-mode" className={classnames('iconfont icon-style', { 'active': visible })} onClick={() => { open() }}>
          {
            visible &&
            <div styleName="style-mode-wrap">
              <div styleName="style-mode-item"><div styleName={classnames('style-mode-light', { 'active': mode === 'light' })} onClick={() => { setMode('light'); setGlobalCSSVar('light') }}></div><span>浅色</span></div>
              <div styleName="style-mode-item"><div styleName={classnames('style-mode-dark', { 'active': mode === 'dark' })}  onClick={() => { setMode('dark'); setGlobalCSSVar('dark') }}></div><span>深色</span></div>
            </div>
          }
        </i>
      </div>
    </div>
  )
}

export default TopBar