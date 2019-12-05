import React, { useState, useEffect } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API'
import { match } from 'react-router'
import dayjs from 'dayjs'
import classNames from 'classnames'
// import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

interface PlaylistProps {
  match: match<PlaylistQueryParams>
}
interface PlaylistQueryParams {
  id: string
}

const Playlist: React.SFC<PlaylistProps> = (props) => {
  const [ tab, setTab ] = useState('comment') // list comment des
  const [ playlist, setPlaylist ] = useState({
    creator: {},
    tracks: []
  })
  useEffect(() => {
    getPlaylist()
  }, [])
  async function getPlaylist () {
    const params = {
      id: props.match.params.id
    }
    try {
      const res = await api.getPlaylist(params)
      setPlaylist(res.data.playlist)
    } catch (e) {}
  }
  function genTabComponent () {
    if (tab === 'list') {
      return <MusicList list={playlist.tracks}></MusicList>
    } else if (tab === 'comment') {
      return <Comment type="playlist"></Comment>
    } else {
      return 
    }
  }
  return (
    <div className="playlist-wrap">
      <div className="playlist-info-wrap">
        <img className="playlist-img" src={playlist.coverImgUrl} />
        <div className="playlist-info">
          <div className="playlist-info-title">
            <span className="playlist-info-title-icon">歌单</span>
            {playlist.name}
          </div>
          <div className="playlist-info-user">
            <img className="playlist-info-user-avatar" src={playlist.creator.avatarUrl} alt=""/>
            <span className="playlist-info-user-name">{playlist.creator.nickname}</span>
            <span className="playlist-info-user-create">{dayjs(playlist.createTime).format('YYYY-MM-DD')}创建</span>
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">
              <div><i className="iconfont iconbofang" ></i>播放全部</div>
              <i className="iconfont icon-add"></i>
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-star"></i>收藏(0)</div>
          </div>
          <div className="playlist-info-num">
            <div>标签:华语/流行/治愈</div>
            <div>歌曲数: 222  播放数: 2222</div>
            <div>简介: 你知道吗...</div>
          </div>
        </div>
      </div>
      <div className="playlist-tab">
        <span onClick={(e) => setTab('list')} className={tab === 'list' ? 'active' : ''}>歌曲列表</span>
        <span onClick={(e) => setTab('comment')} className={tab === 'comment' ? 'active' : ''}>评论({playlist.commentCount || 0})</span>
        <span onClick={(e) => setTab('star')} className={tab === 'star' ? 'active' : ''}>收藏者</span>
      </div>
      {genTabComponent()}
    </div>
  )
}

export default Playlist