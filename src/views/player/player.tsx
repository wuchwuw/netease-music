import React, { useState, useRef } from 'react'
import './player.less'
import { useSelector, useDispatch } from 'react-redux'
import { timeFormat } from 'UTIL/util'
import { RootState } from 'STORE/index'
import { PLAYER_FULL_SCREEN, PlyerMode, SET_MODE } from 'STORE/player/types'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'
import FullScreenPlayer from './full-screen-player'
import { usePanelContaienr, PanelType } from 'VIEWS/panel/container'
import { usePlayerController } from 'UTIL/player-controller'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import { useFavorite } from 'UTIL/favorite'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { useLocation } from 'react-router'
import Icon from 'COMPONENTS/icon/icon'

const voice_shared = {
  pageY: 0,
  diffY: 0
}

export default function Player () {
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const mode = useSelector((state: RootState) => state.player.mode)
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
  const { addFMTrash, playerStatus, prev, next, togglePlay, currentSong: { song: currentSong }, playing } = usePlayerController()
  const { goArtistDetail, goFM } = usePageForword()
  const { isFavorite, favorite } = useFavorite()
  const { shouldUpdateUserFavoritePlaylist } = useUserPlaylist()
  const location = useLocation()

  const [voice, setVoice] = useState(50)
  const [voiceMoved, setVoiceMoved] = useState(false)
  const voiceBar = useRef<HTMLDivElement>(null)

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
    if (currentSong.name) {
      return (
        <span>{currentSong.name} - {genArtists(currentSong.artists, goArtistDetail, 'commen-link-666666')}</span>
      )
    }
    return currentSong.name ? `${currentSong.name} - ${currentSong.artistName}` : ''
  }

  function onEnd () {
    next()
  }

  function setFullScreen () {
    if (!currentSong.id) return
    if (playerStatus === 'fm') {
      goFM()
    } else {
      dispatch({ type: PLAYER_FULL_SCREEN, fullScreen: !fullScreen })
    }
  }

  function onVoicePointerDown (e: React.PointerEvent<HTMLDivElement>) {
    setVoiceMoved(true)
    voice_shared.pageY = e.pageY
  }
  function onVoicePointerMove (e: React.PointerEvent<HTMLDivElement>) {
    if (!voiceMoved) return
    voice_shared.diffY = voice_shared.pageY - e.pageY
    voice_shared.pageY = e.pageY
    setVoice(voice => {
      const v = voice + voice_shared.diffY
      return Math.max(0, Math.min(v, 80))
    })
  }

  function onVoicePointerUp () {
    setVoiceMoved(false)
    audioRef.current!.volume = voice / 80
  }

  function setPlayerMode () {
    let nextMode = mode + 1 > 3 ? 0 : mode + 1
    dispatch({ type: SET_MODE, mode: nextMode })
  }

  function genPlayerModeIcon () {
    if (playerStatus === 'fm') return null
    const cls = ['loop', 'loopone', 'random', 'order']
    const text = ['列表循环', '单曲循环', '随机播放', '顺序播放']
    return (
      <span styleName="mini-player-mode-wrap">
        <Icon onClick={setPlayerMode} name={`icon-${cls[mode]}`}></Icon>
        <span>{text[mode]}</span>
      </span>
    )
  }

  function currentSongFavorite () {
    if (!currentSong.id) return
    const path = location.pathname.split('/')
    favorite(currentSong.id, () => {
      if (path.length && path[1] === 'playlist') {
        shouldUpdateUserFavoritePlaylist(Number(path[2]))
      }
    })
  }

  return (
    <>
      <div styleName="mini-player-wrap">
        <div ref={progressWrapRef} styleName="mini-player-progress-wrap">
          <div styleName="mini-player-progress-default"></div>
          <div ref={progressRef} styleName="mini-player-progress" style={{width: `${precent}%`}}>
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              styleName="mini-player-progress-icon"
              >
            </div>
          </div>
        </div>
        <div styleName="mini-player-content">
          <div styleName="mini-player-song">
            {
              currentSong.id && (
                <>
                  <img onClick={setFullScreen} styleName="mini-player-song-img" src={currentSong.album.picUrl+'?param=100y100'} alt=""/>
                  <div styleName="mini-player-song-info">
                    <div styleName="mini-player-song-name">{getSongName()}</div>
                    <div styleName="mini-player-song-duration">{getCurrentTime()}</div>
                  </div>
                </>
              )
            }
          </div>
          <div styleName="mini-player-control">
            <Icon className={`icon-color-${isFavorite(currentSong.id) ? 'main' : '6'} hover`} style={{marginRight: '25px'}} onClick={() => { currentSongFavorite() } } name={isFavorite(currentSong.id) ? 'icon-heart-full' : 'iconxin'}></Icon>
            <Icon className="icon-color-main hover" style={{marginRight: '10px'}} fontSize={18} onClick={prev} name={classnames('iconfont iconforward', { 'fail': playerStatus === 'fm'})}></Icon>
            <Icon className="icon-color-main hover" fontSize={40} onClick={togglePlay} name={!playing ? 'icon-play': 'iconzanting'}></Icon>
            <Icon className="icon-color-main hover" style={{marginLeft: '10px'}} fontSize={18} onClick={next} name="iconfont iconforward1"></Icon>
            { playerStatus === 'fm' && <Icon onClick={() => { addFMTrash(currentSong.id) }} style={{fontSize: '19px', marginLeft: '20px'}} name="icon-delete"></Icon>}
          </div>
          <div styleName="mini-player-action">
            { genPlayerModeIcon() }
            { playerStatus !== 'fm' && <span id="playlist-icon"><Icon style={{marginLeft: '20px'}} onClick={() => {setPanelType(PanelType.CurrentPlaylist) }} name="iconlist" className={classnames({'icon-color-main': currentPanelType === PanelType.CurrentPlaylist})}></Icon></span>}
            <span styleName="mini-player-voice-wrap">
              <Icon name="icon1"></Icon>
              <div styleName="mini-player-voice">
                <div styleName="mini-player-voice-content">
                  <div ref={voiceBar} styleName="mini-player-voice-bar-default"></div>
                  <div style={{height: `${voice}px`}} styleName="mini-player-voice-bar"></div>
                  <div
                    style={{bottom: `${voice - 6}px`}}
                    styleName="mini-player-voice-control"
                    onPointerDown={onVoicePointerDown}
                    onPointerMove={onVoicePointerMove}
                    onPointerUp={onVoicePointerUp}
                  >
                  </div>
                </div>
              </div>
            </span>
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