import React from 'react'
import './player.less'

export default function Player () {
  return (
    <div className="player-wrap">
      <div className="player-progress-wrap">
        <div className="player-progress-default"></div>
        <div className="player-progress"></div>
        <div className="player-progress-icon"></div>
      </div>
      <div className="player-content">
        <div className="player-song">
          <img className="player-song-img" src="https://p2.music.126.net/MW4c6muvi4BumqpoMW_e7A==/109951164522119612.jpg" alt=""/>
          <div className="player-song-info">
            <div className="player-song-name">2019年十一月最热新歌TOP50</div>
            <div className="player-song-duration">00:00 / 00:00</div>
          </div>
        </div>
        <div className="player-control">
          <i className="iconfont iconxin"></i>
          <i className="iconfont iconforward"></i>
          <i className="iconfont iconbofang"></i>
          <i className="iconfont iconforward1"></i>
        </div>
        <div className="player-action">
          <i className="iconfont iconxunhuan"></i>
          <i className="iconfont iconlist"></i>
          <i className="iconfont icon1"></i>
        </div>
      </div>
    </div>
  )
}