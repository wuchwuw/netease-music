import React from 'react'
import './current-playlist.less'
import classnames from 'classnames'
import { usePlayerController } from "UTIL/player-controller"
import Icon from "COMPONENTS/icon/icon"
import { genSongName, genArtists } from "VIEWS/template/template"
import { usePageForword } from "ROUTER/hooks"
import { useFavorite } from "UTIL/favorite"
import { createAddPlaylistSongDialog, createShareDialog, ShareType } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from 'UTIL/user-playlist'

const CurrentPlaylist: React.SFC = () => {
  const { currentSong, currentMusiclist, start } = usePlayerController()
  const { goArtistDetail, goPage } = usePageForword()
  const { favorite, isFavorite } = useFavorite()
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const openPlaylistSongDialog = createShareDialog()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()

  return (
    <div styleName="current-playlist-container">
      <div styleName="current-playlist-title-wrap">
        <div styleName="current-playlist-title">播放列表</div>
        <div styleName="current-playlist-action">
          <span styleName="current-playlist-action-title">共{currentMusiclist.length}首</span>
          <span onClick={() => { openAddPlaylistSongDialog({songs: currentMusiclist.map(item => item.song), addOrRemoveSong, userPlaylist})}} styleName="current-playlist-action-star"><Icon className="icon-color-6 hover" name="icon-add"></Icon>添加到</span>
          <span styleName="current-playlist-action-delete"><Icon className="icon-color-6 hover"  name="icon-delete"></Icon>清空</span>
        </div>
      </div>
      <ul styleName="current-music-list-wrap">
        {
          (currentMusiclist.length !== 0) ?
          currentMusiclist.map(({song, source}) => (
            <li
              onDoubleClick={() => start({id: '', name: ''}, song) }
              key={song.id} styleName={classnames('current-music-list-item', { 'active': currentSong.song.id === song.id })}
            >
              <img src={song.album.picUrl + '?param=100y100'} alt=""/>
              <div styleName="current-music-list-item-info">
                <div>{genSongName(song)}</div>
                <div className="text-overflow" style={{ marginTop: '8px', fontSize: '12px'}}>{genArtists(song.artists, goArtistDetail, 'commen-link-666666')}</div>
              </div>
              <div styleName="current-music-list-item-info-option">
                <div styleName="current-music-list-item-info-option-duration">{song.duration_string}</div>
                <div styleName="current-music-list-item-info-option-icon">
                  <Icon
                    onClick={() => { favorite(song.id) }}
                    name={`${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}
                    className={`icon-color-${isFavorite(song.id) ? 'main' : '6'} hover`}
                  >
                  </Icon>
                  <Icon onClick={() => { openAddPlaylistSongDialog({songs: [song], addOrRemoveSong, userPlaylist})}} className="icon-color-6 hover" name="icon-add"></Icon>
                  <Icon onClick={() => { openPlaylistSongDialog({ share: { type: ShareType.SONG, content: song } }) }} className="icon-color-6 hover" name="icon-share"></Icon>
                  <Icon onClick={() => { goPage(source.id) }} className="icon-color-6 hover" name="icon-link"></Icon>
                </div>
              </div>
            </li>
          ))
          :
          <div styleName="current-playlist-nodata">
            <div>你还没有添加任何歌曲</div>
            <div styleName="current-playlist-nodata-text">去首页<span className="commen-link-333333 active">发现音乐</span></div>
          </div>
        }
      </ul>
    </div>
  )
}

export default CurrentPlaylist