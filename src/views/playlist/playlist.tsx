import React, { useState, useEffect } from 'react'
import './playlist.less'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { useParams } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'

const Playlist = () => {
  const [ tab, setTab ] = useState('list') // list comment des
  const { id } = useParams()
  const playlistId = Number(id)
  const [ playlist, setPlaylist ] = useState<PlaylistClass>(new PlaylistClass({}))
  
  useEffect(() => {
    getPlaylist()
    setTab('list')
  }, [playlistId])

  async function getPlaylist () {
    const params = {
      id: playlistId
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
      return <div style={{ padding: '30px'}}><Comment type="playlist" id={playlistId}></Comment></div>
    } else {
      return
    }
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
            <div className="playlist-info-action-star"><i className="iconfont icon-star"></i>收藏({playlist.subscribedCount_string})</div>
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
          <span onClick={(e) => setTab('list')} className={tab === 'list' ? 'active' : ''}>歌曲列表</span>
          <span onClick={(e) => setTab('comment')} className={tab === 'comment' ? 'active' : ''}>评论({playlist.commentCount || 0})</span>
          <span onClick={(e) => setTab('star')} className={tab === 'star' ? 'active' : ''}>收藏者</span>
        </div>
      </div>
      {genTabComponent()}
    </div>
  )
}

export default Playlist