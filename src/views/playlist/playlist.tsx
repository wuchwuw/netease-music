import React, { useState, useEffect, useMemo } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { useParams } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import classnames from 'classnames'
import { usePlayerController } from 'UTIL/player-controller'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { useSongContextMenu } from 'UTIL/menu'
import Song from 'UTIL/song'
import { usePageForword } from 'ROUTER/hooks'
import Subscribers from './subscribers'

enum PlaylistTab {
  SONG = 'SONG',
  COMMENT = 'COMMENT',
  SUB = 'SUB'
}

const PlaylistTabMap = {
  'SONG': '歌曲列表',
  'COMMENT': '评论',
  'SUB': '收藏者'
}

let playlistCache = {}

const Playlist = () => {
  const [ tab, setTab ] = useState<PlaylistTab>(PlaylistTab.SONG)
  const { id } = useParams()
  const playlistId = Number(id)
  const [ playlist, setPlaylist ] = useState<PlaylistClass>(new PlaylistClass({}))
  const { start, nextPlayPlaylist } = usePlayerController()
  const { subscribePlaylist, isMyFavotitePlaylist, isUserPlaylist, removeSongWidthComfirm } = useUserPlaylist()
  const { getSongMenu } = useSongContextMenu()
  const { goUserDetail } = usePageForword()
  const shouldUpdateFavoritePlaylist = useSelector((state: RootState) => state.commen.shouldUpdateFavoritePlaylist)

  const isEmpty = useMemo(() => playlist.tracks.length === 0, [playlist.id])
  const isPersonal = useMemo(() => isUserPlaylist(playlist.id), [playlist.id])
  const isOrigin = useMemo(() => isMyFavotitePlaylist(playlist.id), [playlist.id])

  useEffect(() => {
    getPlaylist()
  }, [playlistId, shouldUpdateFavoritePlaylist])

  useEffect(() => {
    setTab(PlaylistTab.SONG)
  }, [playlistId])

  async function getPlaylist () {
    const params = {
      id: playlistId
    }
    try {
      const res = await api.getPlaylist(params)
      if (isMyFavotitePlaylist(res.data.playlist.id)) {
        res.data.playlist.name = '我最喜欢的音乐'
      }
      playlistCache = res.data.playlist
      setPlaylist(new PlaylistClass(playlistCache))
    } catch (e) {}
  }

  function updatePlaylist () {
    getPlaylist()
  }

  async function follow () {
    if (isPersonal) return
    subscribePlaylist(playlist, (p) => {
      setPlaylist(new PlaylistClass({ ...playlistCache, subscribedCount: p.subscribedCount, subscribed: p.subscribed }))
    })
  }

  function getMenu (song: Song) {
    return getSongMenu({ id: `playlist-${playlist.id}`, name: playlist.name }, song, playlist, updatePlaylist)
  }

  function musiclistStart (song: Song) {
    start({ id: `playlist-${playlist.id}`, name: playlist.name }, song, playlist.tracks)
  }

  function genTabComponent () {
    if (tab === PlaylistTab.SONG) {
      return <MusicList start={musiclistStart} getMenu={getMenu} list={playlist.tracks} {...deleteMyFavorite()}></MusicList>
    } else if (tab === PlaylistTab.COMMENT) {
      return <div style={{padding: '30px'}}><Comment type="playlist" id={playlistId}></Comment></div>
    } else if (tab === PlaylistTab.SUB) {
      return <Subscribers playlistId={playlistId}></Subscribers>
    } else {
      return
    }
  }

  function genPlaylistTag (playlist: PlaylistClass) {
    const tags = playlist.tags
    const isShowEdit = !isOrigin && isPersonal
    if (tags.length) {
      return (
        <div>
          <span className="playlist-info-num-label">标签：</span>
          {
            tags.map((item, index) => <><span className="commen-link-blue">{item}</span> {index !== tags.length - 1 ? '/' : ''} </>)
          }
        </div>
      )
    } else {
      return isShowEdit ? <div><span className="playlist-info-num-label">标签：</span><span className="commen-link-blue">添加标签</span></div> : null
    }
  }

  function genPlaylistDesc (playlist: PlaylistClass) {
    const isShowEdit = !isOrigin && isPersonal
    if (playlist.description) {
      return <div className="playlist-info-desc clid"><span className="playlist-info-num-label">简介：</span>{playlist.description}<i className="iconfont icon-triangle-full down"></i></div>
    } else {
      return isShowEdit ? <div className="playlist-info-desc clid"><span className="playlist-info-num-label">简介：</span><span className="commen-link-blue">添加简介</span></div> : null
    }
  }

  function getSource () {
    return {
      id: `playlist-${playlist.id}`,
      name: playlist.name
    }
  }

  function deleteMyFavorite () {
    if (isOrigin) {
      return {
        deleteMyFavorite: (song: Song) => {
          removeSongWidthComfirm(playlist.id, song.id, updatePlaylist)
        }
      }
    } else {
      return {}
    }
  }

  return (
    <div className="playlist-wrap">
      <div className="playlist-info-wrap">
        <div className="playlist-img" style={{backgroundImage: `url(${playlist.coverImgUrl})`}}></div>
        <div className="playlist-info">
          <div className="playlist-info-title">
            <span className="playlist-info-title-icon">歌单</span>
            {playlist.name}
          </div>
          <div className="playlist-info-user">
            <div className="playlist-info-user-avatar" style={{backgroundImage: `url(${playlist.creator.avatarUrl})`}}></div>
            {
              playlist.creator.nickname &&
              <>
                <span className="playlist-info-user-name" onClick={() => { goUserDetail(playlist.creator.userId) }}>{playlist.creator.nickname}</span>
                <span className="playlist-info-user-create">{playlist.createTimeString}创建</span>
              </>
            }
          </div>
          <div className="playlist-info-action">
            <div className={classnames('playlist-info-action-playall', { 'fail': isEmpty })}>
              <div onClick={() => { start(getSource(), playlist.tracks[0], playlist.tracks) }}><i className="iconfont icon-play" ></i>播放全部</div>
              <i className="iconfont icon-add" onClick={() => { nextPlayPlaylist(getSource(), playlist.tracks) }}></i>
            </div>
            <div
              onClick={() => { follow() }}
              className={classnames('playlist-info-action-star', { 'fail': isPersonal })}
            >
              <i className="iconfont icon-star"></i>
              {playlist.subscribed ? '已收藏' : '收藏'}({playlist.subscribedCount_string})
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-share"></i>分享({playlist.shareCount_string})</div>
          </div>
          <div className="playlist-info-num">
            {genPlaylistTag(playlist)}
            <div>歌曲数: {playlist.trackCount}&nbsp;&nbsp;&nbsp;播放数: {playlist.playCount_string}</div>
            {genPlaylistDesc(playlist)}
          </div>
        </div>
      </div>
      <div className="playlist-tab-wrap">
        <div className="playlist-tab">
          {
            (Object.keys(PlaylistTab) as PlaylistTab[]).map((item => (
              <span onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>
                {PlaylistTabMap[item]}{item === PlaylistTab.COMMENT ? `(${playlist.commentCount})` : ''}
              </span>
            )))
          }
        </div>
      </div>
      {genTabComponent()}
    </div>
  )
}

export default Playlist