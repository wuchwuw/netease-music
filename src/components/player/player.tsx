import React, { useState, useRef, useMemo } from 'react'
import './player.less'
import { useSelector } from 'react-redux'
import { getSongTime } from 'UTIL/util'
import { RootState } from 'STORE/index'
import { useDispatch } from 'react-redux'
import { SET_PLAY_STATUS, PLAY_NEXT, PLAY_PREV, PLAYER_FULL_SCREEN } from 'STORE/player/types'
import Comment from 'COMPONENTS/comment/comment'
import classnames from 'classnames'
import { CSSTransition } from 'react-transition-group'

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

  function onPointerDown (e: React.PointerEvent<HTMLDivElement>) {
    // e.persist()
    setMoved(true)
    setPageX(e.pageX)
    setLeft(precent / 100 * progressWrapRef.current!.clientWidth)
  }
  function onPointerMove (e: React.PointerEvent<HTMLDivElement>) {
    // e.persist()
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

  function setFullScreen () {
    console.log(1)
    dispatch({ type: PLAYER_FULL_SCREEN, fullScreen: !fullScreen })
  }
  const id = '3073492173'
  const CommentComponent = useMemo(() => <Comment type="playlist" id={id} />, [id]);
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
            <i onClick={play} className={classnames('iconfont', { 'iconbofang': !playing, 'iconzanting': playing })}></i>
            <i onClick={next} className="iconfont iconforward1"></i>
          </div>
          <div className="mini-player-action">
            <i className="iconfont iconxunhuan"></i>
            <i className="iconfont iconlist"></i>
            <i className="iconfont icon1"></i>
          </div>
        </div>
        <audio ref={audioRef} id="player-audio" onTimeUpdate={onTimeUpdate} onEnded={onEnd}></audio>
      </div>
      <CSSTransition in={fullScreen} timeout={500} unmountOnExit classNames="player-slider">
        <div className="player">
          <div className="player-wrap">
            <div className="player-cd-wrap">
              <div className="player-cd"></div>
              <div className="player-action">
                <i className="iconfont iconxin"></i>
                <i className="iconfont iconxin"></i>
                <i className="iconfont iconxin"></i>
                <i className="iconfont iconxin"></i>
              </div>
            </div>
            <div className="player-info">
              <div className="player-info-name">棉被</div>
              <div className="player-info-album">
                <div>专辑:<span>十大电台</span></div>
                <div>歌手:<span>金玟岐</span></div>
                <div>来源:<span>这些生活必需品</span></div>
              </div>
              <div className="player-info-lyrics">
                <p className="player-info-lyrics-item active">作曲 : 金玟岐</p>
                <p className="player-info-lyrics-item">作词 : 金玟岐</p>
                <p className="player-info-lyrics-item">制作人/编曲：薛琳可</p>
                <p className="player-info-lyrics-item">你是掌心的天地</p>
                <p className="player-info-lyrics-item">你是我视线所及</p>
                <p className="player-info-lyrics-item">你是我流落荒岛指定伴侣</p>
                <p className="player-info-lyrics-item">我要和你在一起</p>
                <p className="player-info-lyrics-item">你这裡有黄金屋</p>
                <p className="player-info-lyrics-item">你这裡有颜如玉</p>
                <p className="player-info-lyrics-item">你身体住满我朋友亲戚</p>
                <p className="player-info-lyrics-item">我怎么忍心放下你</p>
                <p className="player-info-lyrics-item">我天生有一些长情</p>
              </div>
            </div>
          </div>
          <div className="player-other-info">
            <div className="player-other-comment">
              {CommentComponent}
            </div>
            <div className="player-other-list">
              <div className="player-other-list-playlist">
                <div className="player-other-list-title">包含这首歌的歌单</div>
                <div className="player-other-list-item">
                  <img className="player-other-list-avatar" src="https://p3.music.126.net/yeLMBHft3oDrpg8G_fjIRA==/109951163603810637.jpg?param=35y35" alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">日子有点苦的时候，听这些歌在</div>
                    <div className="player-other-list-info-text">2222万</div>
                  </div>
                </div>
              </div>
              <div className="player-other-list-song">
                <div className="player-other-list-title">相似歌曲</div>
                <div className="player-other-list-item">
                  <img className="player-other-list-avatar" src="https://p3.music.126.net/yeLMBHft3oDrpg8G_fjIRA==/109951163603810637.jpg?param=35y35" alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">日子有点苦的时候，听这些歌在</div>
                    <div className="player-other-list-info-text">2222万</div>
                  </div>
                </div>
              </div>
              <div className="player-other-list-like">
                <div className="player-other-list-title">喜欢这首歌的人</div>
                <div className="player-other-list-item">
                  <img className="player-other-list-avatar" src="https://p3.music.126.net/yeLMBHft3oDrpg8G_fjIRA==/109951163603810637.jpg?param=35y35" alt=""/>
                  <div className="player-other-list-info">
                    <div className="player-other-list-info-name text-overflow">日子有点苦的时候，听这些歌在点苦的时候，听这些歌 </div>
                    <div className="player-other-list-info-text">2222万</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CSSTransition>
    </>
  )
}