import React, { useEffect, useMemo } from 'react'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import './fm.less'
import { useFavorite } from 'UTIL/favorite'
import Lyric from 'VIEWS/player/lyric'
import Icon from 'COMPONENTS/icon/icon'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import { FMType } from 'STORE/player/types'
import { useContainer } from 'COMPONENTS/container/container'
import { createAddPlaylistSongDialog, createShareDialog } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { ShareType } from 'COMPONENTS/dialog/activity-publish/activity-publish'

const FM = () => {
  const { fmPrev, playerStatus ,currentFM, startFM, initFM, fmScreenMusicList, playing, next, addFMTrash } = usePlayerController()
  const CommentComponent = useMemo(() => <Comment delay={500} showTitle={true} type="music" id={currentFM.song.id} />, [currentFM.song.id])
  const { favorite, isFavorite } = useFavorite()
  const { goArtistDetail, goAlbumDetail } = usePageForword()
  const { open, visible } = useContainer([])
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const openShareDialog = createShareDialog()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()

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

  function handleFMCoverClick (type: FMType) {
    const prev = fmScreenMusicList.find(item => item.type === 'prev')!
    if (type === 'prev' && prev.song.id) {
      fmPrev()
    }
  }

  return (
    <div styleName="fm-container">
      <div styleName="fm-song">
        <div styleName="fm-song-left">
          <div styleName="fm-song-cover">
            {
              fmScreenMusicList.map(fm => (
                <div onClick={() => { handleFMCoverClick(fm.type) }} key={fm.song.id} styleName={`fm-song-cover-content ${fm.type}`}>
                  <img src={fm.song.album.picUrl + '?param=400y400'} alt=""/>
                </div>
              ))
            }
            <div onClick={() => { startFM() }} styleName={`fm-play-icon ${isPlaying() ? 'pause' : 'play'}`}>
              <Icon className="icon-color-main" fontSize={18} name={`${isPlaying() ? 'icon-pause' : 'icon-triangle-full'}`}></Icon>
            </div>
          </div>
          <div styleName="fm-action">
            <Icon
              className={`icon-color-${isFavorite(currentFM.song.id) ? 'main' : '6'}`}
              styleName="fm-action-item"
              onClick={() => { favorite(currentFM.song.id) }}
              name={`${isFavorite(currentFM.song.id) ? 'icon-heart-full' : 'iconxin'}`}>
            </Icon>
            <Icon className="icon-color-6" styleName="fm-action-item" onClick={() => { addFMTrash(currentFM.song.id) }} name="icon-delete"></Icon>
            <Icon className="icon-color-6" styleName="fm-action-item" onClick={() => { next() }} name="icon-fmnext"></Icon>
            <span onClick={open} styleName="fm-action-item fm-context-menu-wrap">
              <Icon className="icon-color-6" name="icon-menu"></Icon>
              {
                visible && (
                  <ul styleName="fm-context-menu">
                    <li onClick={() => { openAddPlaylistSongDialog({ songs: [currentFM.song], userPlaylist, addOrRemoveSong }) }} className="fm-context-menu-item">收藏</li>
                    <li onClick={() => { openShareDialog({ shareContent: currentFM.song, type: ShareType.SONG }) }} className="fm-context-menu-item">分享</li>
                  </ul>
                )
              }
            </span>
          </div>
        </div>
        <div styleName="fm-info">
          <div styleName="fm-info-name">{currentFM.song.name}</div>
          <div styleName="fm-info-album">
            <div>专辑:<span onClick={() => { goAlbumDetail(currentFM.song.album.id) }} styleName="fm-info-album-text" className="commen-link-blue">{currentFM.song.album.name}</span></div>
            <div>歌手:<span styleName="fm-info-album-text">{genArtists(currentFM.song.artists, goArtistDetail, 'commen-link-blue')}</span></div>
          </div>
          <Lyric song={currentFM.song}></Lyric>
        </div>
      </div>
      { CommentComponent }
    </div>
  )
}

export default FM