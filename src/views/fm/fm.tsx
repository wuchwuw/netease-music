import React, { useEffect, useMemo } from 'react'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'
import { useFavorite } from 'UTIL/favorite'
import Lyric from 'VIEWS/player/lyric'
import Icon from 'COMPONENTS/icon/icon'

const FM = () => {
  const { playerStatus ,currentFM, startFM, initFM, fmScreenMusicList, playing, next, addFMTrash } = usePlayerController()
  const CommentComponent = useMemo(() => <Comment delay={500} showTitle={true} type="music" id={currentFM.song.id} />, [currentFM.song.id])
  const { favorite, isFavorite } = useFavorite()

  useEffect(() => {
    initFM()
  }, [])

  function isPlaying () {
    if (playerStatus === 'default') {
      return false
    } else {
      return playing
    }
  }

  return (
    <div className="fm-container">
      <div className="fm-song">
        <div className="fm-song-left">
          <div className="fm-song-cover">
            {
              fmScreenMusicList.map(fm => (
                <div key={fm.song.id} className={`fm-song-cover-content ${fm.type}`}>
                  <img src={fm.song.album.picUrl + '?param=400y400'} alt=""/>
                </div>
              ))
            }
            <div onClick={() => { startFM() }} className={`fm-play-icon ${isPlaying() ? 'pause' : 'play'}`}>
              <Icon className="icon-color-main" fontSize={18} name={`${isPlaying() ? 'icon-pause' : 'icon-triangle-full'}`}></Icon>
            </div>
          </div>
          <div className="fm-action">
            <Icon
              className={`icon-color-${isFavorite(currentFM.song.id) ? 'main' : '6'}`}
              onClick={() => { favorite(currentFM.song.id) }}
              name={`${isFavorite(currentFM.song.id) ? 'icon-heart-full' : 'iconxin'}`}
            ></Icon>
            <Icon className="icon-color-6" onClick={() => { addFMTrash(currentFM.song.id) }} name="icon-delete"></Icon>
            <Icon className="icon-color-6" onClick={() => { next() }} name="icon-fmnext"></Icon>
            <Icon className="icon-color-6" name="icon-menu"></Icon>
          </div>
        </div>
        <div className="fm-info">
          <div className="fm-info-name">{currentFM.song.name}</div>
          <div className="fm-info-album">
            <div>专辑:<span className="commen-link-blue">{currentFM.song.album.name}</span></div>
            <div>歌手:<span className="commen-link-blue">{currentFM.song.artistName}</span></div>
          </div>
          <div className="fm-info-lyrics">
            <Lyric song={currentFM.song}></Lyric>
          </div>
        </div>
      </div>
      { CommentComponent }
    </div>
  )
}

export default FM