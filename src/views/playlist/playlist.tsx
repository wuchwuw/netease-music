import React, { useState, useEffect } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { useParams } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'
import User from 'UTIL/user'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'


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
  const { goUserDetail, } = usePageForword()

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
      setPlaylist(new PlaylistClass(playlistCache = res.data.playlist))
    } catch (e) {}
  }

  async function follow (isFollow: boolean) {
    try {
      const t = isFollow ? 2 : 1
      const subscribedCount = isFollow ? -- playlist.subscribedCount : ++ playlist.subscribedCount
      await api.playlistSubscribers({ t, id: playlistId })
      setPlaylist(new PlaylistClass({ ...playlistCache, subscribedCount, subscribed: !isFollow }))
    } catch (e) {}
  }

  function genTabComponent () {
    if (tab === PlaylistTab.SONG) {
      return <MusicList list={playlist.tracks}></MusicList>
    } else if (tab === PlaylistTab.COMMENT) {
      return <div style={{ padding: '30px'}}><Comment type="playlist" id={playlistId}></Comment></div>
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
      console.log(res)
    } catch (e) {}
  }

  function genPlaylistTag (playlist: PlaylistClass) {
    const tags = playlist.tags
    if (tags.length) {
      return tags.map((item, index) => <><span className="commen-link-blue">{item}</span> {index !== tags.length - 1 ? '/' : ''} </>)
    } else {
      return <span className="commen-link-blue">添加标签</span>
    }
  }

  function genPlaylistDesc (playlist: PlaylistClass) {
    if (playlist.description) {
      return  <div className="playlist-info-desc clid">简介: {playlist.description}<i className="iconfont icon-triangle-full down"></i></div>
    } else {
      return <div className="playlist-info-desc clid">简介: <span className="commen-link-blue">添加简介</span></div>
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
            <div className="playlist-info-action-playall">
              <div><i className="iconfont icon-play" ></i>播放全部</div>
              <i className="iconfont icon-add"></i>
            </div>
            <div onClick={() => { follow(playlist.subscribed) }} className="playlist-info-action-star">
              <i className="iconfont icon-add-folder"></i>
              {playlist.subscribed ? '已收藏' : '收藏'}({playlist.subscribedCount_string})
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-share"></i>分享({playlist.shareCount_string})</div>
          </div>
          <div className="playlist-info-num">
            <div>标签: {genPlaylistTag(playlist)}</div>
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