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
import { useSongContextMenu, MenuType } from 'UTIL/menu'
import { PlaylistClass } from 'UTIL/playlist'

interface MusicListProps {
  list: Song[]
  updateList: () => void
  playlist?: PlaylistClass
}

const MENU_NAME = 'music-list-contextmenu'

const Menu = ({id, trigger}: any) => {
  const menu: MenuType[] = trigger && trigger.menu || []
  return (
    <ContextMenu id={id} className="context-menu">
      {
        menu.map((item) => {
          return (
            item.sub ?
              <SubMenu title='收藏' attributes={{className: 'context-menu-item'}}>
                {
                  item.sub.map(menu => (
                    <MenuItem attributes={{className: 'context-menu-item'}} onClick={ menu.trigger() } data={menu.data}>{menu.name}</MenuItem>
                  ))
                }
              </SubMenu>
              :
              <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => { item.trigger() }} data={{ action: 'Added' }}>{item.name}</MenuItem>
            
          )
        })
      }
    </ContextMenu>
  )
}

const ConnectedMenu = connectMenu(MENU_NAME)(Menu);


const MusicList: React.SFC<MusicListProps> = ({list = [], updateList, playlist}) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()
  const { getSongMenu } = useSongContextMenu()

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
              <ContextMenuTrigger holdToDisplay={1000} id={MENU_NAME} menu={getSongMenu(playlist)} collect={props => props}>
                <div onDoubleClick={() => start(item, list) } key={item.id} className="music-list-item">
                  <div className="music-list-item-action">
                    <span>{ currentSong.id === item.id ? <i className="iconfont icon-sound"></i> : padZero(index + 1)}</span>
                    <i onClick={() => { favorite(item.id, () => {}) }} className={`iconfont ${isFavorite(item.id) ? 'icon-heart-full' : 'iconxin'}`}></i>
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