import React, { useEffect } from 'react'
import './music-list.less'
import Song from '../../util/song'

interface MusicListProps {
  list: Song[]
}

const MusicList: React.SFC<MusicListProps> = (props) => {
  function padZero(n: number) {
    return n <= 9 ? `0${n}` : n
  }
  function getTime (time: any) {
    time = (time / 1000).toFixed(0)
    let min = Math.floor(time / 60)
    let s = time - min * 60
    return `${padZero(min)}:${padZero(s)}`
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
          <li key={item.id} className="music-list-item">
            <div className="music-list-item-action">
              <span>{padZero(index + 1)}</span>
              <i className="iconfont iconxin"></i>
            </div>
            <div>
              <div className="text-overflow" title={item.name}>{item.name}</div>
            </div>
            <div>
              <div className="text-overflow" title={item.ar[0].name}>{item.ar[0].name}</div>
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