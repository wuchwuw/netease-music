import React, { useState } from "react"
import './current-playlist.less'
import classnames from 'classnames'
import { usePlayerController } from "UTIL/player-controller"
import Icon from "COMPONENTS/icon/icon"

const CurrentPlaylist: React.SFC = () => {
  const { currentSong, currentMusiclist, start, playHistory } = usePlayerController()
  const [tab, setTab] = useState('playlist')
  const CURRENT_PLAYLIST_PANEL_TAB = {
    playlist: '播放列表',
    history: '历史记录'
  }

  function selectTab (tab: string) {
    setTab(tab)
  }

  function getLength () {
    return tab === 'playlist' ? currentMusiclist.length : playHistory.length
  }

  return (
    <div styleName="current-playlist-container">
      <div styleName="current-playlist-tab">
        {
          (Object.keys(CURRENT_PLAYLIST_PANEL_TAB) as Array<keyof typeof CURRENT_PLAYLIST_PANEL_TAB>).map((key) => (
            <div onClick={() => selectTab(key)} key={key} styleName={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
      <div styleName="current-playlist-action">
        <span styleName="current-playlist-action-title">总{getLength()}首</span>
        <span styleName="current-playlist-action-star"><Icon name="icon-add-folder"></Icon>收藏全部</span>
        <span styleName="current-playlist-action-delete"><Icon name="icon-delete"></Icon>清空</span>
      </div>
      <ul styleName="current-music-list-wrap">
        {
          (getLength() !== 0) ? 
          (tab === 'playlist' ? currentMusiclist : playHistory).map(({song, source}) => (
            <li onDoubleClick={() => start({id: '', name: ''}, song) } key={song.id} styleName="current-music-list-item">
              <div></div>
              <div>
                <div className="text-overflow" styleName={classnames({ 'music-list-item-playing': song.id === currentSong.song.id })} title={song.name}>{song.name}</div>
              </div>
              <div>
                <div className="text-overflow" title={song.artistName}>{song.artistName}</div>
              </div>
              <div>
                <Icon name="icon-link"></Icon>
              </div>
              <div>
              <div className="text-overflow">{song.duration_string}</div>
              </div>
            </li>
          ))
          :
          <div styleName="current-playlist-nodata">
            <div>你还没有{tab === 'playlist' ? '添加' : '播放' }任何歌曲</div>
            <div styleName="current-playlist-nodata-text">去首页<span className="commen-link-333333 active">发现音乐</span></div>
          </div>
        }
      </ul>
    </div>
  )
}

export default CurrentPlaylist