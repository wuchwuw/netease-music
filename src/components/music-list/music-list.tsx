import React, { useEffect } from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { useDispatch, useSelector } from 'react-redux'
import { padZero } from 'UTIL/util'
import { SET_CURRENT_SONG, SET_PLAYLIST, SET_PLAY_STATUS } from 'STORE/player/types'
import classnames from 'classnames'
import { RootState } from 'STORE/index'

interface MusicListProps {
  list: Song[]
}

const MusicList: React.SFC<MusicListProps> = (props) => {
  const dispatch = useDispatch()
  const currentSong = useSelector((state: RootState) => state.player.currentSong)
  function setSong (song: Song) {
    dispatch({ type: SET_CURRENT_SONG, currentSong: song })
    dispatch({ type: SET_PLAYLIST, playlist: props.list })
    dispatch({ type: SET_PLAY_STATUS, playing: true })
    song.getSongUrl()
  }
  return (
    <ul className="music-list">
      <li className="music-list-item">
        <div></div>
        <div>音乐标题</div>
        <div>歌手</div>
        <div>专辑</div>
        <div>时长</div>
      </li>
      {
        props.list.map((item: Song, index: number) => (
          <li onDoubleClick={() => setSong(item) } key={item.id} className="music-list-item">
            <div className="music-list-item-action">
              <span>{padZero(index + 1)}</span>
              <i className="iconfont iconxin"></i>
            </div>
            <div>
              <div className={classnames('text-overflow', { 'music-list-item-playing': item.id === currentSong.id })} title={item.name}>{item.name}</div>
            </div>
            <div>
              <div className="text-overflow" title={item.artistName}>{item.artistName}</div>
            </div>
            <div>
              <div className="text-overflow" title={item.albumName}>{item.albumName}</div>
            </div>
            <div>
            <div className="text-overflow">{item.duration_string}</div>
            </div>
          </li>
        ))
      }
    </ul>
  )
}

export default MusicList