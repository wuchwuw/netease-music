import React from 'react'
import './music-list.less'
import Song from 'UTIL/song'
import { padZero } from 'UTIL/util'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import { genArtists } from 'VIEWS/template/template'
import { useFavorite } from 'UTIL/favorite'
import { ContextMenuTrigger, ContextMenu, MenuItem, SubMenu } from 'react-contextmenu'

interface MusicListProps {
  list: Song[],
  updateList: () => void
}

const CONTEXT_MENU = [
  { action: 'play', name: '播放' },
  { action: 'comment', name: '查看评论' },
  { action: 'next', name: '下一首播放' },
  { action: 'play', name: '收藏' },
]

const MusicList: React.SFC<MusicListProps> = ({list = [], updateList}) => {
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()
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
              <ContextMenuTrigger id="music-list" song={{song: item}} collect={(props) => props.song}>
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
      <ContextMenu id="music-list" className="context-menu">
        <MenuItem attributes={{className: 'context-menu-item'}} onClick={(e, data) => { console.log(data) }} data={{ action: 'Added' }}>播放</MenuItem>
        <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => {}} data={{ action: 'Removed' }}>查看评论</MenuItem>
        <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => {}} data={{ action: 'Removed' }}>下一首播放</MenuItem>
        <SubMenu title='收藏' className="context-menu-item" hoverDelay={500}>
          <MenuItem onClick={() => {}} data={{ item: 'subsubitem 1' }}>SubSubItem 1</MenuItem>
          <MenuItem onClick={() => {}} data={{ item: 'subsubitem 2' }}>SubSubItem 2</MenuItem>
        </SubMenu>
        <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => {}} data={{ action: 'Removed' }}>复制链接</MenuItem>
        <MenuItem attributes={{className: 'context-menu-item'}} onClick={() => {}} data={{ action: 'Removed' }}>从歌单中删除</MenuItem>
      </ContextMenu>
    </>
  )
}

export default MusicList