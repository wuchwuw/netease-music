import React from 'react'
import './message-source.less'
import { PlaylistClass } from 'UTIL/playlist'
import Song from 'UTIL/song'
import { Album } from 'UTIL/album'
import { MV } from 'UTIL/mv'
import { Video } from 'UTIL/video'
// import { genArtists } from 'VIEWS/template/template'

interface PlaylistProps {
  playlist: PlaylistClass
}

export const MessageSourcePlaylist: React.SFC<PlaylistProps> = ({
  playlist
}) => {
  return (
    <div styleName="message-default">
      <img src={playlist.coverImgUrl + '?param=100y100'} alt=""/>
      <div styleName="message-default-info">
        <div styleName="message-default-title"><span styleName="message-default-info-tag">歌单</span>{playlist.name}</div>
        <div styleName="message-default-user">{playlist.creator.nickname}</div>
      </div>
    </div>
  )
}

interface AlbumProps {
  album: Album
}

export const MessageSourceAlbum: React.SFC<AlbumProps> = ({
  album
}) => {
  return (
    <div styleName="message-default">
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

export const MessageSourceSong: React.SFC<SongProps> = ({
  song
}) => {
  return (
    <div styleName="message-default">
      <img src={song.album.picUrl + '?param=100y100'} alt=""/>
      <div styleName="message-default-info">
        <div styleName="message-default-title">{song.name}</div>
        <div styleName="message-default-user">{song.artistName}</div>
      </div>
    </div>
  )
}

interface VideoProps {
  video: Video
  width?: number
}

export const MessageSourceVideo: React.SFC<VideoProps> = ({
  video,
  width = 230
}) => {
  const style = {
    width: `${width}px`,
    height: `${width / 1.77}px`
  }
  return (
    <div styleName="message-video" style={style}>
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

export const MessageSourceMV: React.SFC<MVProps> = ({
  mv,
  width = 230
}) => {
  const style = {
    width: `${width}px`,
    height: `${width / 1.77}px`
  }
  return (
    <div styleName="message-video" style={style}>
      <img styleName="message-video-cover" src={mv.cover + '?param=400y225'} alt=""/>
      <div styleName="message-video-name">{mv.name}</div>
      <div styleName="message-video-info">
        <span>播放{mv.playCount_format}</span>
        <span>{mv.duration_format}</span>
      </div>
    </div>
  )
}