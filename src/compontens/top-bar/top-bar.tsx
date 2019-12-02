import React from 'react'
import './top-bar.less'

export default function TopBar () {
  function renderTopbarContent () {
    return (
      <>
        <div className="topbar-content-item active">个性推荐</div>
        <div className="topbar-content-item">歌单</div>
        <div className="topbar-content-item">主播电台</div>
        <div className="topbar-content-item">排行榜</div>
        <div className="topbar-content-item">歌手</div>
        <div className="topbar-content-item">最新音乐</div>
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