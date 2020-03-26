import React from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'

interface MusicListProps {
  list: Song[]
}

const MusicList: React.SFC<MusicListProps> = (props) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()

  function genArtistName (song: Song) {
    const artists = song.artists

    return artists.map((artist, index) => 
      <>
        <span
          onClick={ (e) => {
            e.stopPropagation() 
            if (!artist.id) return
            goArtistDetail(artist.id)
          }} 
          className={classnames({ 'music-list-item-link': artist.id })}>{artist.name}
        </span>
        { index !== artists.length - 1 ? '/' : '' }
      </>
    )
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
          <li onDoubleClick={() => start(item, props.list) } key={item.id} className="music-list-item">
            <div className="music-list-item-action">
              <span>{ currentSong.id === item.id ? <i className="iconfont icon-sound"></i> : padZero(index + 1)}</span>
              <i className="iconfont iconxin"></i>
            </div>
            <div>
              <div className={classnames('text-overflow', { 'music-list-item-playing': item.id === currentSong.id })} title={item.name}>
                {item.name}
              </div>
              { !!item.mv && <i className="iconfont icon-mv"></i> }
            </div>
            <div>
              <div className="text-overflow" title={item.artistName}>
                { genArtistName(item) }
              </div>
            </div>
            <div>
              <div 
                onClick={(e) => { 
                  e.stopPropagation()
                  goAlbumDetail(item.album.id) 
                }} 
                className="text-overflow music-list-item-link" 
                title={item.album.name}
              >
                {item.album.name}
              </div>
            </div>
            <div>
            <div className="text-overflow muisc-list-item-duration">{item.duration_string}</div>
            </div>
          </li>
        ))
      }
    </ul>
  )
}

export default MusicList