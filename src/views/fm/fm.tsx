import React, { useState, useEffect, useMemo } from 'react'
import api from 'API/index'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'
import { useFavorite } from 'UTIL/favorite'

const FM = () => {
  const [lyric, setLyric] = useState({})
  const { currentFM, startFM, initFM, fmScreenMusicList, playing, next, addFMTrash } = usePlayerController()
  const CommentComponent = useMemo(() => <Comment delay={500} showTitle={true} type="music" id={currentFM.song.id} />, [currentFM.song.id])
  const { favorite, isFavorite } = useFavorite()

  useEffect(() => {
    initFM()
  }, [])

  useEffect(() => {
    if (currentFM.song.id) {
      getFMLyric()
    }
  }, [currentFM.song.id])

  function getFMLyric () {
    currentFM.song.getLyric((lyric: any) => {
      setLyric(lyric)
    })
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-left">
          <div className="fm-song-cover">
            {
              fmScreenMusicList.map(fm => (
                <div key={fm.song.id} className={`fm-song-cover-content ${fm.type}`}>
                  <img src={fm.song.album.picUrl + '?param=500y500'} alt=""/>
                </div>
              ))
            }
            <div onClick={() => { startFM() }} className={`fm-play-icon ${playing ? 'pause' : 'play'}`}>
              <i className={`iconfont ${playing ? 'icon-pause' : 'icon-triangle-full'}`}></i>
            </div>
          </div>
          <div className="fm-action">
            <i onClick={() => { favorite(currentFM.song.id) }} className={`iconfont ${isFavorite(currentFM.song.id) ? 'icon-heart-full' : 'iconxin'}`}></i>
            <i onClick={() => { addFMTrash(currentFM.song.id) }} className="iconfont icon-delete"></i>
            <i onClick={() => { next() }} className="iconfont icon-fmnext"></i>
            <i className="iconfont icon-menu"></i>
          </div>
        </div>
        <div className="fm-info">
          <div className="fm-info-name">{currentFM.song.name}</div>
          <div className="fm-info-album">
            <div>专辑:<span className="commen-link-blue">{currentFM.song.album.name}</span></div>
            <div>歌手:<span className="commen-link-blue">{currentFM.song.artistName}</span></div>
          </div>
          <div className="fm-info-lyrics">
            {
              lyric.lines && lyric.lines.map((item: any, index: any) => (
                <p key={index} className="fm-info-lyrics-item">{item.txt}</p>
              ))
            }
          </div>
        </div>
      </div>
      { CommentComponent }
    </div>
  )
}

export default FM