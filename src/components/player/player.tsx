import React, { useState, useRef } from 'react'
import './player.less'
import { useSelector } from 'react-redux'
import { getSongTime } from 'UTIL/util'
import { RootState } from 'STORE/index'
import { useDispatch } from 'react-redux'
import { SET_PLAY_STATUS, PLAY_NEXT, PLAY_PREV } from 'STORE/player/types'
import classnames from 'classnames'

export default function Player () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const playing = useSelector((state: RootState) => state.player.playing)
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState(0)
  const [precent, setPrecent] = useState(0)
  const [moved, setMoved] = useState(false)
  const [pageX, setPageX] = useState(0)
  const [left, setLeft] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  function onPointerDown (e: React.PointerEvent<HTMLDivElement>) {
    e.persist()
    setMoved(true)
    setPageX(e.pageX)
    setLeft(precent / 100 * progressWrapRef.current!.clientWidth)
  }
  function onPointerMove (e: React.PointerEvent<HTMLDivElement>) {
    e.persist()
    if (!moved) return
    const diffX = e.pageX - pageX
    const currentPrecent = (left + diffX) / (progressWrapRef.current!.clientWidth / 100)
    setPrecent(currentPrecent)
  }
  function onPointerUp (e: React.PointerEvent<HTMLDivElement>) {
    audioRef.current!.currentTime = precent / 100 * currentSong.duration / 1000
    setMoved(false)
  }

  function onTimeUpdate (e: React.SyntheticEvent<HTMLAudioElement>) {
    setCurrentTime((e.target as HTMLAudioElement).currentTime)
    if (!moved) {
      setPrecent((e.target as HTMLAudioElement).currentTime / (currentSong.duration / 100000))
    }
  }
  function getCurrentTime () {
    return currentSong.duration ? `${getSongTime(currentTime)} / ${currentSong.duration_string}` : ''
  }
  function getSongName () {
    return currentSong.name ? `${currentSong.name} - ${currentSong.artistName}` : ''
  }

  function play () {
    if (playing) {
      dispatch({ type: SET_PLAY_STATUS, playing: false })
      audioRef.current!.pause()
    } else {
      dispatch({ type: SET_PLAY_STATUS, playing: true })
      audioRef.current!.play()
    }
  }

  function next () {
    dispatch({ type: PLAY_NEXT })
  }

  function prev () {
    dispatch({ type: PLAY_PREV })
  }

  function onEnd () {
    next()
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
            <div className="player-song-name">{getSongName()}</div>
            <div className="player-song-duration">{getCurrentTime()}</div>
          </div>
        </div>
        <div className="player-control">
          <i className="iconfont iconxin"></i>
          <i onClick={prev} className="iconfont iconforward"></i>
          <i onClick={play} className={classnames('iconfont', { 'iconbofang': !playing, 'iconzanting': playing })}></i>
          <i onClick={next} className="iconfont iconforward1"></i>
        </div>
        <div className="player-action">
          <i className="iconfont iconxunhuan"></i>
          <i className="iconfont iconlist"></i>
          <i className="iconfont icon1"></i>
        </div>
      </div>
      <audio ref={audioRef} id="player-audio" onTimeUpdate={onTimeUpdate} onEnded={onEnd}></audio>
    </div>
  )
}