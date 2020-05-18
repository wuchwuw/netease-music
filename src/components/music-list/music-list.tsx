import React from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import { genArtists } from 'VIEWS/template/template'
import { useFavorite } from 'UTIL/favorite'
import { ContextMenuTrigger, ContextMenu, MenuItem, SubMenu, connectMenu } from 'react-contextmenu'
import { MenuType } from 'UTIL/menu'

const MENU_NAME = 'music-list-contextmenu'
let target: HTMLElement | null = null

const Menu = ({id, trigger}: any) => {
  const menu: MenuType[] = trigger && trigger.menu || []
  return (
    <ContextMenu
      id={id}
      className="context-menu"
      onHide={() => {
        target && target.classList.remove('context-menu-musiclist-selected')
      }}
      onShow={(e) => {
        target = e.detail.target
        target && target.classList.add('context-menu-musiclist-selected')
      }}
    >
      {
        menu.map((item) => {
          return (
            item.sub ?
              <SubMenu title={<div>收藏<i className="iconfont icon-triangle-full"></i></div>} attributes={{className: 'context-menu-item'}}>
                {
                  item.sub.map(menu => (
                    <MenuItem attributes={{className: 'context-menu-item'}} onClick={ () => { menu.trigger && menu.trigger() } }>{menu.name}</MenuItem>
                  ))
                }
              </SubMenu>
              :
              <MenuItem attributes={{className: 'context-menu-item'}} onClick={ () => { item.trigger && item.trigger() } } data={{ action: 'Added' }}>{item.name}</MenuItem>

          )
        })
      }
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu(MENU_NAME)(Menu);

interface MusicListProps {
  list: Song[]
  getMenu: (song: Song) => MenuType[]
  start: (song: Song) => void
}

const MusicList: React.SFC<MusicListProps> = ({list = [], getMenu, start}) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { currentSong } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()

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
            <li className="music-list-item-wrap">
              <ContextMenuTrigger
                id={MENU_NAME}
                menu={getMenu(item)}
                collect={props => props}
              >
                <div onDoubleClick={() => start(item)} key={item.id} className="music-list-item">
                  <div className="music-list-item-action">
                    <span>{ currentSong.song.id === item.id ? <i className="iconfont icon-sound"></i> : padZero(index + 1)}</span>
                    <i onClick={() => { favorite(item.id, () => {}) }} className={`iconfont ${isFavorite(item.id) ? 'icon-heart-full' : 'iconxin'}`}></i>
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
              </ContextMenuTrigger>
            </li>
          ))
        }
      </ul>
      <ConnectedMenu></ConnectedMenu>
    </>
  )
}

export default MusicList