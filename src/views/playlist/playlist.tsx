import React, { useState, useEffect, useMemo } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { useParams } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'
import User from 'UTIL/user'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import classnames from 'classnames'
import { usePlayerController } from 'UTIL/player-controller'
import { useUserPlaylist } from 'UTIL/user-playlist'


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

const SUBSCRIBERS_LIMIT = 30
let playlistCache = {}

const Playlist = () => {
  const [ tab, setTab ] = useState<PlaylistTab>(PlaylistTab.SONG)
  const { id } = useParams()
  const playlistId = Number(id)
  const [ playlist, setPlaylist ] = useState<PlaylistClass>(new PlaylistClass({}))
  const [ subscribers, setSubscribers ] = useState<User[]>([])
  const userPlaylist = useSelector((state: RootState) => state.user.playlist)
  const user = useSelector((state: RootState) => state.user.user)
  const { goUserDetail } = usePageForword()
  const { start, nextPlayPlaylist } = usePlayerController()
  const { subscribePlaylist } = useUserPlaylist()

  const isEmpty = useMemo(() => playlist.tracks.length === 0, [playlist])
  const isPersonal = useMemo(() => userPlaylist.filter(item => item.creator.userId === user.userId).findIndex(item => Number(id) === item.id) > -1, [playlistId])
  const isOrigin = userPlaylist[0] && userPlaylist[0].id && userPlaylist[0].id === playlistId

  useEffect(() => {
    getPlaylist()
    setTab(PlaylistTab.SONG)
  }, [playlistId])

  useEffect(() => {
    if (tab === PlaylistTab.SUB) {
      getSubscribers(1)
    }
  }, [tab])

  async function getPlaylist () {
    const params = {
      id: playlistId
    }
    try {
      const res = await api.getPlaylist(params)
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

  function genTabComponent () {
    if (tab === PlaylistTab.SONG) {
      return <MusicList playlist={playlist} updateList={updatePlaylist} list={playlist.tracks}></MusicList>
    } else if (tab === PlaylistTab.COMMENT) {
      return <div style={{padding: '30px'}}><Comment type="playlist" id={playlistId}></Comment></div>
    } else if (tab === PlaylistTab.SUB) {
      return (
        <div className="playlist-subscribers">
          {
            subscribers.map(user =>
              <div key={user.userId} className="playlist-subscribers-item">
                <img onClick={() => { goUserDetail(user.userId) }} src={user.avatarUrl + '?params=100y100'} alt=""/>
                <div className="playlist-subscribers-info-wrap">
                  <span onClick={() => { goUserDetail(user.userId) }}>{user.nickname}</span>
                  <i className={classNames('iconfont', user.gender === 1 ? 'icon-boy' : 'icon-girl')}></i>
                  { user.signature && <div className="playlist-subscribers-signature">{user.signature}</div> }
                </div>
              </div>
            )
          }
        </div>
      )
    } else {
      return
    }
  }

  async function getSubscribers (page: number) {
    try {
      const offset = (page - 1) * SUBSCRIBERS_LIMIT
      const res = await api.getPlaylistSubscribers({ id: playlistId, limit: SUBSCRIBERS_LIMIT, offset })
      setSubscribers(res.data.subscribers)
    } catch (e) {}
  }

  function genPlaylistTag (playlist: PlaylistClass) {
    if (isOrigin) return null
    const tags = playlist.tags
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
      return <div><span className="playlist-info-num-label">标签：</span><span className="commen-link-blue">添加标签</span></div>
    }
  }

  function genPlaylistDesc (playlist: PlaylistClass) {
    if (isOrigin) return null
    if (playlist.description) {
      return  <div className="playlist-info-desc clid"><span className="playlist-info-num-label">简介：</span>{playlist.description}<i className="iconfont icon-triangle-full down"></i></div>
    } else {
      return <div className="playlist-info-desc clid"><span className="playlist-info-num-label">简介：</span><span className="commen-link-blue">添加简介</span></div>
    }
  }

  function getSource () {
    return {
      id: `playlist-${playlist.id}`,
      name: playlist.name
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
              <i className="iconfont icon-add-folder"></i>
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