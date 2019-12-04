import React, { useState, useEffect } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import api from 'API'
import { match } from 'react-router'
// import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

interface PlaylistProps {
  match: match<PlaylistQueryParams>
}
interface PlaylistQueryParams {
  id: string
}

const Playlist: React.SFC<PlaylistProps> = (props) => {
  const [ playlist, setPlaylist ] = useState({
    creator: {},
    tracks: []
  })
  useEffect(() => {
    console.log(1)
    getPlaylist()
  }, [])
  async function getPlaylist () {
    console.log(api)
    const params = {
      id: props.match.params.id
    }
    try {
      const res = await api.getPlaylist(params)
      setPlaylist(res.data.playlist)
    } catch (e) {}
  }
  return (
    <div className="home-wrap">
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
            <span className="playlist-info-user-create">2015-2-2创建</span>
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">
              <div><i className="iconfont iconbofang" ></i>播放全部</div>
              <i className="iconfont iconxin"></i>
            </div>
            <div className="playlist-info-action-star"><i className="iconfont iconxin"></i>收藏(0)</div>
          </div>
          <div className="playlist-info-num">
            <div>标签:华语/流行/治愈</div>
            <div>歌曲数: 222  播放数: 2222</div>
            <div>简介: 你知道吗...</div>
          </div>
        </div>
      </div>
      <div className="playlist-tab">
        <span className="active">歌曲列表</span>
        <span>评论(402)</span>
        <span>专辑详情</span>
      </div>
      <MusicList list={playlist.tracks}></MusicList>
    </div>
  )
}

export default Playlist