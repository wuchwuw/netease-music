import React from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import { genArtists } from 'VIEWS/template/template'
import { useFavorite } from 'UTIL/favorite'
import { MenuType } from 'UTIL/menu'
import { ContextMenuWrap, ConnectedMenu } from 'COMPONENTS/context-menu/context-menu'

const MENU_NAME = 'music-list-contextmenu'
const Menu = ConnectedMenu(MENU_NAME)

interface MusicListProps {
  list: Song[]
  getMenu: (song: Song) => MenuType[]
  start: (song: Song) => void
  deleteMyFavorite?: (song: Song) => void
}

const MusicList: React.SFC<MusicListProps> = ({ list = [], getMenu, start, deleteMyFavorite }) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { currentSong } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()

  function muisclistFavorite (song: Song) {
    if (deleteMyFavorite) {
      deleteMyFavorite(song)
    } else {
      favorite(song.id)
    }
  }

  return (
    <>
      <ul className="music-list">
        <li className="music-list-item-wrap">
          <div className="music-list-item">
            <div></div>
            <div>音乐标题</div>
            <div>歌手</div>
            <div>专辑</div>
            <div>时长</div>
          </div>
        </li>
        {
          list.map((item: Song, index) => (
            <li className="music-list-item-wrap" key={item.id}>
              <ContextMenuWrap id={MENU_NAME} menu={getMenu(item)}>
                <div onDoubleClick={() => start(item)} className="music-list-item">
                  <div className="music-list-item-action">
                    <span>{ currentSong.song.id === item.id ? <i className="iconfont icon-sound"></i> : padZero(index + 1)}</span>
                    <i onClick={() => { muisclistFavorite(item) }} className={`iconfont ${isFavorite(item.id) ? 'icon-heart-full' : 'iconxin'}`}></i>
                  </div>
                  <div>
                    <div className={classnames('text-overflow', { 'music-list-item-playing': item.id === currentSong.song.id })} title={item.name}>
                      {item.name}<span className="music-list-item-alia">{item.alia_string}</span>
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
                </div>
              </ContextMenuWrap>
            </li>
          ))
        }
      </ul>
      <Menu></Menu>
    </>
  )
}

export default MusicList