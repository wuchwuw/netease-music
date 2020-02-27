import React, { useState, useEffect } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { match } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'
// import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

interface PlaylistProps {
  match: match<PlaylistQueryParams>
}

const Playlist: React.SFC<PlaylistProps> = (props) => {
  const [ tab, setTab ] = useState('list') // list comment des
  const [ playlist, setPlaylist ] = useState<PlaylistClass>(new PlaylistClass({}))
  console.log(playlist)
  useEffect(() => {
    getPlaylist()
  }, [props.match.params.id])
  async function getPlaylist () {
    const params = {
      id: props.match.params.id
    }
    try {
      const res = await api.getPlaylist(params)
      setPlaylist(new PlaylistClass(res.data.playlist))
    } catch (e) {}
  }
  function genTabComponent () {
    if (tab === 'list') {
      return <MusicList list={playlist.tracks}></MusicList>
    } else if (tab === 'comment') {
      return <div style={{ padding: '30px'}}><Comment type="playlist" id={props.match.params.id}></Comment></div>
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
            <span className="playlist-info-user-create">{playlist.createTimeString}创建</span>
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">
              <div><i className="iconfont icon-play" ></i>播放全部</div>
              <i className="iconfont icon-add"></i>
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-star"></i>收藏({playlist.shareCount})</div>
          </div>
          <div className="playlist-info-num">
            <div>标签: {playlist.tag_string}</div>
            <div>歌曲数: {playlist.trackCount}&nbsp;&nbsp;&nbsp;播放数: {playlist.playCount_string}</div>
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