import React from 'react'
import './player.less'
import { useSelector } from 'react-redux'
import Song from '../../util/song'

export default function Player () {
  const currentSong: Song = useSelector(state => state.currentSong)
  console.log(currentSong)
  return (
    <div className="player-wrap">
      <div className="player-progress-wrap">
        <div className="player-progress-default"></div>
        <div className="player-progress"></div>
        <div className="player-progress-icon"></div>
      </div>
      <div className="player-content">
        <div className="player-song">
          <img className="player-song-img" src={currentSong.picUrl+'?param=40y40'} alt=""/>
          <div className="player-song-info">
            <div className="player-song-name">{currentSong.name}</div>
             <div className="player-song-duration">00:00 / {currentSong.duration_string}</div>
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
      <audio id="player-audio"></audio>
    </div>
  )
}