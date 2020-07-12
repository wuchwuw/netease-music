import React from 'react'
import { PlaylistBaseClass } from 'UTIL/playlist'
import Icon from 'COMPONENTS/icon/icon'

interface CommenPlaylistVerticalProps {
  playlist: PlaylistBaseClass
  width?: number
  showUser?: boolean
  goPlaylistDetail?: Function
  goUserDetail?: Function
}

export const CommenPlaylistVertical: React.SFC<CommenPlaylistVerticalProps> = ({
  playlist,
  width = 130,
  showUser = false,
  goPlaylistDetail = () => {},
  goUserDetail = () => {}
}) => {
  return (
    <div onClick={() => goPlaylistDetail() } className={`commen-area-item commen-area-item-playlist-${width}`}>
      <div className="commen-area-img-wrap">
        <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{playlist.playCount_string}</div>
        <img className="commen-area-img" src={playlist.coverImgUrl+'?param=250y250'} alt=""/>
        <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
        {
          showUser && (
            <div className="commen-area-user" onClick={(e) => { e.stopPropagation(); goUserDetail(playlist.creator.userId) }}><Icon name="icon-user"></Icon>{playlist.creator.nickname}</div>
          )
        }
      </div>
      <div className="commen-area-text line-more">{playlist.name}</div>
    </div>
  )
}