import React, { useState, useEffect, useMemo, useRef } from 'react'
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
import Song, { getSongList } from 'UTIL/song'
import { usePageForword } from 'ROUTER/hooks'
import Subscribers from './subscribers'
import { getPlaylistCache, setPlaylistCache, getPlaylistTracksCache, setPlaylistTracksCache } from 'UTIL/playlist-cache'
import Spin from 'COMPONENTS/spin/spin'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import { createShareDialog, ShareType } from 'COMPONENTS/dialog/create'

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
  const playlistDefault = getPlaylistCache(playlistId)
  const tracksDefault = getPlaylistTracksCache(playlistId)
  const [ playlist, setPlaylist ] = useState<PlaylistClass>(playlistDefault)
  const [tracks, setTracks] = useState<Song[]>(tracksDefault)
  const { start, nextPlayPlaylist } = usePlayerController()
  const { subscribePlaylist, isMyFavotitePlaylist, isUserPlaylist, removeSongWidthComfirm } = useUserPlaylist()
  const { getSongMenu } = useSongContextMenu()
  const { goUserDetail, goPlaylistEdit, goPlaylistDiscover } = usePageForword()
  const shouldUpdateFavoritePlaylist = useSelector((state: RootState) => state.commen.shouldUpdateFavoritePlaylist)
  const isEmpty = useMemo(() => playlist.trackCount === 0, [playlist.trackCount])
  const isPersonal = useMemo(() => isUserPlaylist(playlist.id), [playlist.id])
  const isOrigin = useMemo(() => isMyFavotitePlaylist(playlist.id), [playlist.id])
  const [trackloading, setTrackLoading] = useState(tracksDefault.length === 0)
  const openShareDialog = createShareDialog()
  const time = useRef(0)

  useEffect(() => {
    return () => {
      time.current = ++time.current
    }
  }, [playlistId])

  useEffect(() => {
    getPlaylist()
  }, [playlistId])

  useEffect(() => {
    setTracks(getPlaylistTracksCache(playlistId))
  }, [shouldUpdateFavoritePlaylist])

  useEffect(() => {
    if (tab === PlaylistTab.SONG) return
    setTab(PlaylistTab.SONG)
  }, [playlistId])

  useEffect(() => {
    setPlaylist(playlistDefault)
    if (tracksDefault.length) {
      setTracks(tracksDefault)
    } else {
      setTrackLoading(true)
    }
  }, [playlistId])

  async function getPlaylist () {
    const currentTime = time.current
    const params = {
      id: playlistId
    }
    try {
      const res = await api.getPlaylist(params)
      if (isMyFavotitePlaylist(res.data.playlist.id)) {
        res.data.playlist.name = '我喜欢的音乐'
      }
      playlistCache = res.data.playlist
      const p = new PlaylistClass(res.data.playlist)
      if (time.current === currentTime) {
        setPlaylist(p)
        setPlaylistCache(p)
      }
      const songs = await getSongList(res.data.playlist.trackIds.map((item: any) => item.id))
      if (time.current === currentTime) {
        setTracks(songs)
        setPlaylistTracksCache(p.id, songs)
      }
      setTrackLoading(false)
    } catch (e) {}
  }

  function updatePlaylist () {}

  async function follow () {
    if (isPersonal) return
    subscribePlaylist(playlist, (p) => {
      setPlaylist(new PlaylistClass({ ...playlistCache, subscribedCount: p.subscribedCount, subscribed: p.subscribed }))
    })
  }

  function getMenu (song: Song) {
    return getSongMenu({ id: `/playlist/${playlist.id}`, name: playlist.name }, song, playlist, updatePlaylist)
  }

  function musiclistStart (song: Song) {
    start({ id: `/playlist/${playlist.id}`, name: playlist.name }, song, playlist.tracks)
  }

  function genTabComponent () {
    if (tab === PlaylistTab.SONG) {
      return (
        <MusicList noDataText="暂无歌曲，快去添加歌曲到歌单吧" loading={trackloading} start={musiclistStart} getMenu={getMenu} list={tracks} {...deleteMyFavorite()}></MusicList>
      )
    } else if (tab === PlaylistTab.COMMENT) {
      return <div style={{padding: '30px'}}><Comment type="playlist" id={playlistId}></Comment></div>
    } else if (tab === PlaylistTab.SUB) {
      return <Subscribers playlistId={playlistId}></Subscribers>
    } else {
      return
    }
  }

  function getSource () {
    return {
      id: `/playlist/${playlist.id}`,
      name: playlist.name
    }
  }

  function deleteMyFavorite () {
    if (isOrigin) {
      return {
        deleteMyFavorite: (song: Song) => {
          removeSongWidthComfirm(playlist.id, song, updatePlaylist)
        }
      }
    } else {
      return {}
    }
  }

  function genPlaylistTag (playlist: PlaylistClass) {
    const tags = playlist.tags
    const isShowEdit = !isOrigin && isPersonal
    if (tags.length) {
      return (
        <div>
          <span styleName="playlist-info-num-label">标签：</span>
          {
            tags.map((item, index) => <><span onClick={() => { goPlaylistDiscover({ cate: item }) }} className="commen-link-blue">{item}</span> {index !== tags.length - 1 ? '/' : ''} </>)
          }
        </div>
      )
    } else {
      return isShowEdit ? <div><span styleName="playlist-info-num-label">标签：</span><span onClick={() => { goPlaylistEdit(playlistId) }} className="commen-link-blue">添加标签</span></div> : null
    }
  }

  function genPlaylistDesc (playlist: PlaylistClass) {
    const isShowEdit = !isOrigin && isPersonal
    if (playlist.description) {
      return <div styleName="playlist-info-desc clid"><span styleName="playlist-info-num-label">简介：</span>{playlist.description}<Icon fontSize={12} name="icon-triangle-full" styleName="down"></Icon></div>
    } else {
      return isShowEdit ? <div styleName="playlist-info-desc clid"><span styleName="playlist-info-num-label">简介：</span><span onClick={() => { goPlaylistEdit(playlistId) }} className="commen-link-blue">添加简介</span></div> : null
    }
  }

  return (
    <div styleName="playlist-wrap">
      <div styleName="playlist-info-wrap">
        <img styleName="playlist-img" src={playlist.coverImgUrl} alt=""/>
        <div styleName="playlist-info">
          <div styleName="playlist-info-title">
            <span styleName="playlist-info-title-icon">歌单</span>
            {playlist.name}
          </div>
          <div styleName="playlist-info-user">
            <div styleName="playlist-info-user-avatar" style={{backgroundImage: `url(${playlist.creator.avatarUrl})`}}></div>
            {
              playlist.creator.nickname &&
              <>
                <span styleName="playlist-info-user-name" onClick={() => { goUserDetail(playlist.creator.userId) }}>{playlist.creator.nickname}</span>
                <span>{playlist.createTimeString}创建</span>
              </>
            }
          </div>
          <div styleName="playlist-info-action">
            <div styleName={classnames('playlist-info-action-playall', { 'fail': isEmpty })}>
              <div onClick={() => { start(getSource(), playlist.tracks[0], playlist.tracks) }}><Icon name="icon-play"></Icon>播放全部</div>
              <Icon name="icon-add" onClick={() => { nextPlayPlaylist(getSource(), playlist.tracks) }}></Icon>
            </div>
            <Button
              onClick={() => { follow() }}
              // className={classnames('playlist-info-action-star', { 'fail': isPersonal })}
              icon={<Icon name="icon-star"></Icon>}
            >
              {playlist.subscribed ? '已收藏' : '收藏'}({playlist.subscribedCount_string})
            </Button>
            <Button onClick={() => { openShareDialog({ type: ShareType.PLAYLIST, shareContent: playlist }) }} icon={<Icon name="icon-share"></Icon>}>分享({playlist.shareCount_string})</Button>
          </div>
          <div styleName="playlist-info-num">
            {genPlaylistTag(playlist)}
            <div>歌曲数: {playlist.trackCount}&nbsp;&nbsp;&nbsp;播放数: {playlist.playCount_string}</div>
            {genPlaylistDesc(playlist)}
          </div>
        </div>
      </div>
      <div styleName="playlist-tab-wrap">
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