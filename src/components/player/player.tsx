import React, { useState, useRef } from 'react'
import './player.less'
import { useSelector } from 'react-redux'
import Song from '../../util/song'
import { getSongTime } from '../../util/util'

export default function Player () {
  const currentSong: Song = useSelector(state => state.currentSong)
  const [currentTime, setCurrentTime] = useState(0)
  const [precent, setPrecent] = useState(0)
  const [moved, setMoved] = useState(false)
  const [pageX, setPageX] = useState(0)
  const [left, setLeft] = useState(0)
  const progressRef = useRef(null)
  const progressWrapRef = useRef(null)
  const audioRef = useRef(null)

  function onPointerDown (e) {
    e.persist()
    console.log(e)
    setMoved(true)
    setPageX(e.pageX)
    setLeft(precent / 100 * progressWrapRef.current.clientWidth)
    console.log(progressWrapRef.current.clientWidth)
  }
  function onPointerMove (e) {
    e.persist()
    // console.log(moved)
    // console.log(pageX)
    // console.log(e.target.pageX )
    if (!moved) return
    const diffX = e.pageX - pageX
    const currentPrecent = (left + diffX) / (progressWrapRef.current.clientWidth / 100)
    console.log(currentPrecent)
    console.log(diffX)
    console.log(left)
    setPrecent(currentPrecent)
  }
  function onPointerUp (e) {
    audioRef.current.currentTime = precent / 100 * currentSong.duration / 1000
    setMoved(false)
  }

  function onTimeUpdate (e) {
    setCurrentTime(e.target.currentTime)
    if (!moved) {
      setPrecent(e.target.currentTime / (currentSong.duration / 100000))
    }
  }
  return (
    <div className="player-wrap">
      <div ref={progressWrapRef} className="player-progress-wrap">
        <div className="player-progress-default"></div>
        <div ref={progressRef} className="player-progress" style={{width: `${precent}%`}}>
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            className="player-progress-icon"
            >
          </div>
        </div>
      </div>
      <div className="player-content">
        <div className="player-song">
          <img className="player-song-img" src={currentSong.picUrl+'?param=40y40'} alt=""/>
          <div className="player-song-info">
            <div className="player-song-name">{currentSong.name}</div>
             <div className="player-song-duration">{getSongTime(currentTime)} / {currentSong.duration_string}</div>
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
      <audio ref={audioRef} id="player-audio" onTimeUpdate={onTimeUpdate}></audio>
    </div>
  )
}