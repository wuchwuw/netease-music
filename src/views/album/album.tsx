import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Album as AlbumClass } from 'UTIL/album'
import api from 'API/index'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'

const Album = () => {
  const { id } = useParams()
  const albumId = Number(id)
  const [ tab, setTab ] = useState('list') // list comment des
  const [ album, setAlbum ] = useState<AlbumClass>(new AlbumClass({}))
  useEffect(() => {
    getAlbum()
  }, [albumId])
  async function getAlbum () {
    try {
      const res = await api.getAlbumContent({ id: albumId })
      setAlbum(new AlbumClass({ ...res.data.album, songs: res.data.songs }))
    } catch (e) {}
  }
  function genTabComponent () {
    if (tab === 'list') {
      return <MusicList list={album.songs}></MusicList>
    } else if (tab === 'comment') {
      return <div style={{ padding: '30px'}}><Comment type="album" id={albumId}></Comment></div>
    } else {
      return
    }
  }
  function genAlbumArtists (album: AlbumClass) { 
    const artists = album.artists
    let artistNode: React.ReactNode[] = []
    artists.forEach((artist, index) => {
      artistNode.push(<span className="commen-link-blue">{artist.name}</span>)
      if (index !== artists.length - 1) {
        artistNode.push('/')
      }
    })
    return artistNode
  }
  return (
    <div className="playlist-wrap">
      <div className="playlist-info-wrap">
        <img className="playlist-img" src={album.picUrl} />
        <div className="playlist-info">
          <div className="playlist-info-title">
            <span className="playlist-info-title-icon">专辑</span>
            {album.name}
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">
              <div><i className="iconfont icon-play" ></i>播放全部</div>
              <i className="iconfont icon-add"></i>
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-star"></i>收藏({album.info.shareCount})</div>
          </div>
          <div className="playlist-info-num">
            <div>歌手: {genAlbumArtists(album)}</div>
            <div>时间: {album.publishTimeFormat}</div>
          </div>
        </div>
      </div>
      <div className="playlist-tab-wrap">
        <div className="playlist-tab">
          <span onClick={(e) => setTab('list')} className={tab === 'list' ? 'active' : ''}>歌曲列表</span>
          <span onClick={(e) => setTab('comment')} className={tab === 'comment' ? 'active' : ''}>评论({album.info.commentCount || 0})</span>
          <span onClick={(e) => setTab('star')} className={tab === 'star' ? 'active' : ''}>专辑详情</span>
        </div>
      </div>
      {genTabComponent()}
    </div>
  )
}

export default Album