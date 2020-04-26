import React from 'react'
import './music-list.less'
import Song, { updateFavoriteIds } from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import api from 'API/index'
import { genArtists } from 'VIEWS/template/template'

interface MusicListProps {
  list: Song[],
  updateList: () => void
}

const MusicList: React.SFC<MusicListProps> = ({list = [], updateList}) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()

  async function favorite (song: Song, index: number) {
    try {
      const like = !song.liked
      await api.like({ id: song.id, like})
      updateFavoriteIds(song.id)
      updateList()
    } catch (e) {}
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
        list.map((item: Song, index) => (
          <li onDoubleClick={() => start(item, list) } key={item.id} className="music-list-item">
            <div className="music-list-item-action">
              <span>{ currentSong.id === item.id ? <i className="iconfont icon-sound"></i> : padZero(index + 1)}</span>
              <i onClick={() => { favorite(item, index) }} className={`iconfont ${item.liked ? 'icon-heart-full' : 'iconxin'}`}></i>
            </div>
            <div>
              <div className={classnames('text-overflow', { 'music-list-item-playing': item.id === currentSong.id })} title={item.name}>
                {item.name}
              </div>
              { !!item.mv && <i className="iconfont icon-mv"></i> }
            </div>
            <div>
              <div className="text-overflow" title={item.artistName}>
                { genArtists(item.artists, goArtistDetail, 'commen-link-666666') }
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