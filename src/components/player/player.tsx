import React, { useState, useRef } from 'react'
import './player.less'
import { useSelector, useDispatch } from 'react-redux'
import { timeFormat } from 'UTIL/util'
import { RootState } from 'STORE/index'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import FullScreenPlayer from './full-screen-player'
import { usePanelContaienr, PanelType } from 'VIEWS/panel/container'
import { usePlayerController } from 'UTIL/player-controller'

export default function Player () {
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const playing = useSelector((state: RootState) => state.player.playing)
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const dispatch = useDispatch()
  const [currentTime, setCurrentTime] = useState(0)
  const [precent, setPrecent] = useState(0)
  const [moved, setMoved] = useState(false)
  const [pageX, setPageX] = useState(0)
  const [left, setLeft] = useState(0)
  const progressRef = useRef<HTMLDivElement>(null)
  const progressWrapRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const { setPanelType, currentPanelType } = usePanelContaienr()
  const { prev, next, togglePlay } = usePlayerController()

  function onPointerDown (e: React.PointerEvent<HTMLDivElement>) {
    setMoved(true)
    setPageX(e.pageX)
    setLeft(precent / 100 * progressWrapRef.current!.clientWidth)
  }
  function onPointerMove (e: React.PointerEvent<HTMLDivElement>) {
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
    return currentSong.duration ? `${timeFormat(currentTime)} / ${currentSong.duration_string}` : ''
  }
  
  function getSongName () {
    return currentSong.name ? `${currentSong.name} - ${currentSong.artistName}` : ''
  }

  function onEnd () {
    next()
  }

  function setFullScreen () {
    if (!currentSong.id) return
    dispatch({ type: PLAYER_FULL_SCREEN, fullScreen: !fullScreen })
  }

  return (
    <>
      <div className="mini-player-wrap">
        <div ref={progressWrapRef} className="mini-player-progress-wrap">
          <div className="mini-player-progress-default"></div>
          <div ref={progressRef} className="mini-player-progress" style={{width: `${precent}%`}}>
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="mini-player-progress-icon"
              >
            </div>
          </div>
        </div>
        <div className="mini-player-content">
          <div className="mini-player-song">
            <img onClick={setFullScreen} className="mini-player-song-img" src={currentSong.picUrl+'?param=40y40'} alt=""/>
            <div className="mini-player-song-info">
              <div className="mini-player-song-name">{getSongName()}</div>
              <div className="mini-player-song-duration">{getCurrentTime()}</div>
            </div>
          </div>
          <div className="mini-player-control">
            <i className="iconfont iconxin"></i>
            <i onClick={prev} className="iconfont iconforward"></i>
            <i onClick={togglePlay} className={classnames('iconfont', { 'icon-play': !playing, 'iconzanting': playing })}></i>
            <i onClick={next} className="iconfont iconforward1"></i>
          </div>
          <div className="mini-player-action">
            <i className="iconfont iconxunhuan"></i>
            <i onClick={() => { setPanelType(PanelType.CurrentPlaylist) }} className={classnames('iconfont iconlist', {'active': currentPanelType === PanelType.CurrentPlaylist})}></i>
            <i className="iconfont icon1"></i>
          </div>
        </div>
        <audio ref={audioRef} id="player-audio" onTimeUpdate={onTimeUpdate} onEnded={onEnd}></audio>
      </div>
      <CSSTransition in={fullScreen} timeout={500} unmountOnExit classNames="player-slider">
        <FullScreenPlayer></FullScreenPlayer>
      </CSSTransition>
    </>
  )
}