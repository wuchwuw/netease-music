import React, { useState } from "react"
import './current-playlist.less'
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "STORE/index"
import { SET_CURRENT_SONG, SET_PLAY_STATUS } from 'STORE/player/types'
import Song from "UTIL/song"
import classnames from 'classnames'

const CurrentPlaylist: React.SFC = () => {
  const dispatch = useDispatch()
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  const playlist = useSelector((state: RootState) => state.player.playlist)
  const history = useSelector((state: RootState) => state.player.playlist)
  const [list, setList] = useState<Song[]>(playlist)
  const [tab, setTab] = useState('playlist')
  const CURRENT_PLAYLIST_PANEL_TAB = {
    playlist: '播放列表',
    history: '历史记录'
  }

  function setSong (song: Song) {
    dispatch({ type: SET_CURRENT_SONG, currentSong: song })
    dispatch({ type: SET_PLAY_STATUS, playing: true })
  }

  function selectTab (tab: string) {
    setTab(tab)
    setList(tab === 'playlist' ? playlist : history)
  }

  return (
    <div className="current-playlist-container">
      <div className="current-playlist-tab">
        {
          (Object.keys(CURRENT_PLAYLIST_PANEL_TAB) as Array<keyof typeof CURRENT_PLAYLIST_PANEL_TAB>).map((key) => (
            <div onClick={() => selectTab(key)} key={key} className={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
      <div className="current-playlist-action">
        <span className="current-playlist-action-title">总{list.length}首</span>
        <span className="current-playlist-action-star"><i className="iconfont icon-star"></i>收藏全部</span>
        <span className="current-playlist-action-delete"><i className="iconfont icon-star"></i>清空</span>
      </div>
      <ul className="current-music-list-wrap">
        {
          list.map(item => (
            <li onDoubleClick={() => setSong(item) } key={item.id} className="current-music-list-item">
              <div></div>
              <div>
                <div className={classnames('text-overflow', { 'music-list-item-playing': item.id === currentSong.id })} title={item.name}>{item.name}</div>
              </div>
              <div>
                <div className="text-overflow" title={item.artistName}>{item.artistName}</div>
              </div>
              <div>
                <i className="iconfont icon-link"></i>
              </div>
              <div>
              <div className="text-overflow">{item.duration_string}</div>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default CurrentPlaylist