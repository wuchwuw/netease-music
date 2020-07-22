import React from 'react'
import './message-source.less'
import { PlaylistClass } from 'UTIL/playlist'
import Song from 'UTIL/song'
import { Album, AlbumBaseClass } from 'UTIL/album'
import { MV } from 'UTIL/mv'
import { Video, VideoBaseClass } from 'UTIL/video'
import Icon from 'COMPONENTS/icon/icon'
// import { genArtists } from 'VIEWS/template/template'

interface CommenProps {
  onClick?: React.MouseEventHandler<HTMLElement>
}

interface PlaylistProps {
  playlist: PlaylistClass
}

export const MessageSourcePlaylist: React.SFC<PlaylistProps & CommenProps> = ({
  playlist,
  onClick
}) => {
  return (
    <div styleName="message-default" onClick={onClick}>
      <img src={playlist.coverImgUrl + '?param=100y100'} alt=""/>
      <div styleName="message-default-info">
        <div styleName="message-default-title"><span styleName="message-default-info-tag">歌单</span>{playlist.name}</div>
        <div styleName="message-default-user">{playlist.creator.nickname}</div>
      </div>
    </div>
  )
}

interface AlbumProps {
  album: AlbumBaseClass
}

export const MessageSourceAlbum: React.SFC<AlbumProps & CommenProps> = ({
  album,
  onClick
}) => {
  return (
    <div styleName="message-default" onClick={onClick}>
      <img src={album.picUrl + '?param=100y100'} alt=""/>
      <div styleName="message-default-info">
        <div styleName="message-default-title"><span styleName="message-default-info-tag">专辑</span>{album.name}</div>
        <div styleName="message-default-user">{album.artistName}</div>
      </div>
    </div>
  )
}

interface SongProps {
  song: Song
}

export const MessageSourceSong: React.SFC<SongProps & CommenProps> = ({
  song,
  onClick
}) => {
  return (
    <div styleName="message-default" onClick={onClick}>
      <div styleName="message-default-img-wrap">
        <Icon
          name="icon-triangle-full"
          styleName="message-default-icon"
          fontSize={12}
        >
        </Icon>
        <img src={song.album.picUrl + '?param=100y100'} alt=""/>
      </div>
      <div styleName="message-default-info">
        <div styleName="message-default-title">{song.name}</div>
        <div styleName="message-default-user">{song.artistName}</div>
      </div>
    </div>
  )
}

interface VideoProps {
  video: VideoBaseClass
  width?: number
}

export const MessageSourceVideo: React.SFC<VideoProps & CommenProps> = ({
  video,
  width = 230,
  onClick
}) => {
  const style = {
    width: `${width}px`,
    height: `${width / 1.77}px`
  }
  return (
    <div styleName="message-video" style={style} onClick={onClick}>
      <Icon
        name="icon-triangle-full"
        styleName="message-default-icon"
        fontSize={12}
      >
      </Icon>
      <img styleName="message-video-cover" src={video.coverUrl + '?param=400y225'} alt=""/>
      <div styleName="message-video-name">{video.title}</div>
      <div styleName="message-video-info">
        <span>播放{video.playTime_format}</span>
        <span>{video.duration_format}</span>
      </div>
    </div>
  )
}

interface MVProps {
  mv: MV
  width?: number
}

export const MessageSourceMV: React.SFC<MVProps & CommenProps> = ({
  mv,
  width = 230,
  onClick
}) => {
  const style = {
    width: `${width}px`,
    height: `${width / 1.77}px`
  }
  return (
    <div styleName="message-video" style={style} onClick={onClick}>
      <Icon
        name="icon-triangle-full"
        styleName="message-default-icon"
        fontSize={12}
      >
      </Icon>
      <img styleName="message-video-cover" src={mv.cover + '?param=400y225'} alt=""/>
      <div styleName="message-video-name">{mv.name}</div>
      <div styleName="message-video-info">
        <span>播放{mv.playCount_format}</span>
        <span>{mv.duration_format}</span>
      </div>
    </div>
  )
}