import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from 'API/index'
import './artist.less'
import { createArtist, Artist as ArtistClass } from 'UTIL/artist'
import Song, { createSongList } from 'UTIL/song'

const Artist = () => {
  const { id } = useParams()
  const artistId = Number(id)
  const [ artist, setArtist ] = useState<ArtistClass>(createArtist({}))
  const [ tab, setTab ] = useState('album') // list comment des
  const [ hotSong, setHotSong ] = useState<Song[]>([])
  const [ albums, setAlbums ] = useState([])

  useEffect(() => {
    getArtistDetail()
    getArtistAlbum()
  }, [])

  async function getArtistDetail () {
    try {
      const res = await api.getArtistDetail({ id: artistId })
      setArtist(createArtist(res.data.artist))
      setHotSong(createSongList(res.data.hotSongs))
    } catch (e) {}
  }

  async function getArtistAlbum () {
    try {
      const res = await api.getArtistAlbum({ id: artistId, limit: 5 })
      const p = res.data.hotAlbums.map((item: any) => api.getAlbumContent({ id: item.id }))
      const allContents = await Promise.all(p)
      
    } catch (e) { console.log(e) }
  }
  
  function genArtistContent (tab) {
    switch (tab) {
      case 'album':
        return genArtistAlbumContent()
    }
  }

  function genArtistAlbumContent () {
    return (
      <div>
        {/* {
          toplistIndex.map(playlist => (
            <div key={playlist.id} className="toplist-netease-item">
              <img className="toplist-netease-item-img" src={playlist.coverImgUrl} alt=""/>
              <div className="toplist-netease-item-list">
                {
                  playlist.tracks.slice(0, 5).map((track, index) => (
                    <div className="toplist-netease-item-list-item" key={track.id}>
                      <span>{index + 1}</span>
                      <span>{track.name}</span>
                      <span>{track.artistName}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        } */}
      </div>
    )
  }

  return (
    <div className="artist-container">
      <div className="artist-info-wrap">
        <img src={artist.img1v1Url} alt=""/>
        <div className="artist-info">
          <span className="artist-info-name">{artist.name}</span>
          <div className="artist-info-option">
            <span className="artist-info-option-star"><i className="iconfont icon-star"></i>收藏</span>
            <span className="artist-info-option-user">个人主页</span>
          </div>
          <div className="artist-info-other">
            <span>单曲数: {artist.musicSize}</span>
            <span>专辑数: {artist.albumSize}</span>
            <span>MV数: {artist.mvSize}</span>
          </div>
        </div>    
      </div>

      <div className="playlist-tab">
        <span onClick={(e) => setTab('album')} className={tab === 'album' ? 'active' : ''}>专辑</span>
        <span onClick={(e) => setTab('comment')} className={tab === 'comment' ? 'active' : ''}>MV</span>
        <span onClick={(e) => setTab('star')} className={tab === 'star' ? 'active' : ''}>歌手详情</span>
        <span onClick={(e) => setTab('star')} className={tab === 'star' ? 'active' : ''}>相似歌手</span>
      </div>
      <div className="artist-tab-content">
        {
          genArtistContent(tab)
        }
      </div>
    </div>
  )
}

export default Artist