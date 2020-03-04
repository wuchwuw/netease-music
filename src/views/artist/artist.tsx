import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from 'API/index'
import './artist.less'
import { createArtist, Artist as ArtistClass } from 'UTIL/artist'
import Song, { createSongList } from 'UTIL/song'
import { createAlbumList, Album } from 'UTIL/album'
import { padZero } from 'UTIL/util'
import { createBaseVideoList, VideoBaseClass } from 'UTIL/video'
import { createBaseArtistList, ArtistBaseClass } from 'UTIL/artist'
import top50 from 'ASSETS/images/top50.jpg'

interface ArtistDesc {
  ti: string
  txt: string
}

const Artist = () => {
  const { id } = useParams()
  const artistId = Number(id)
  const [ artist, setArtist ] = useState<ArtistClass>(createArtist({}))
  const [ tab, setTab ] = useState('album') // list comment des
  const [ hotSong, setHotSong ] = useState<Song[]>([])
  const [ albums, setAlbums ] = useState<Album[]>([])
  const [ mv, setMV ] = useState<VideoBaseClass[]>([])
  const [ desc, setDesc ] = useState<ArtistDesc[]>([])
  const [ simi, setSimi ] = useState<ArtistBaseClass[]>([])

  useEffect(() => {
    getArtistDetail()
    getArtistAlbum()
    getArtistMv()
    getArtistDesc()
    getArtistSimi()
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
      const res = await api.getArtistAlbum({ id: artistId, limit: 10 })
      const p = res.data.hotAlbums.map((item: any) => api.getAlbumContent({ id: item.id }))
      const allContents = await Promise.all(p)
      const albums = createAlbumList(allContents.map((item: any) => {
        return { ...item.data.album, songs: item.data.songs }
      }))
      setAlbums(albums)
    } catch (e) { console.log(e) }
  }

  async function getArtistMv () {
    try {
      const res = await api.getArtistMV({ id: artistId })
      setMV(createBaseVideoList(res.data.mvs))
    } catch (e) { console.log(e) }
  }

  async function getArtistDesc () {
    try {
      const res = await api.getArtistDesc({ id: artistId })
      const reslut = res.data
      let desc = reslut.briefDesc ? [{ ti: '歌手简介', txt: reslut.briefDesc }] : []
      setDesc(desc.concat(reslut.introduction))
    } catch (e) { console.log(e) }
  }

  async function getArtistSimi () {
    try {
      const res = await api.getArtistSimi({ id: artistId })
      setSimi(createBaseArtistList(res.data.artists))
    } catch (e) { console.log(e) }
  }
  
  function genArtistContent (tab) {
    switch (tab) {
      case 'album':
        return genArtistAlbumContent()
      case 'mv':
        return genArtistMVContent()
      case 'desc':
        return genArtistDescContent()
      case 'simi':
        return genArtistSimiContent()
      default:
        return <></>
    }
  }

  function genArtistAlbumContent () {
    return (
      <div>
        <div className="artist-album-item">
          <img className="artist-album-item-img" src={top50} alt=""/>
          <div className="artist-album-item-list">
            <div className="artist-album-name">
              热门50首
              <span><i className="iconfont icon-play"></i><i className="iconfont icon-add"></i></span>
            </div>
            {
              hotSong.slice(0, 10).map((song, index) => (
                <div className="artist-album-item-list-item" key={song.id}>
                  <span>{padZero(index + 1)}</span>
                  <span><i className="iconfont iconxin"></i></span>
                  <span>{song.name}</span>
                </div>
              ))
            }
          </div>
        </div>
        {
          albums.map(album => (
            <div key={album.id} className="artist-album-item">
              <img className="artist-album-item-img" src={album.picUrl} alt=""/>
              <div className="artist-album-item-list">
                <div className="artist-album-name">
                  {album.name}
                  <span><i className="iconfont icon-play"></i><i className="iconfont icon-add"></i></span>
                </div>
                {
                  album.songs.slice(0, 10).map((song, index) => (
                    <div className="artist-album-item-list-item" key={song.id}>
                      <span>{padZero(index + 1)}</span>
                      <span><i className="iconfont iconxin"></i></span>
                      <span>{song.name}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    )
  }

  function genArtistMVContent () {
    return (
      <div className="commen-video-content">
        {
          mv.map(item => (
            <div key={item.id} className="commen-video-item commen-video-item-large">
              <div className="commen-video-img-wrap">
                <div className="commen-video-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <img src={item.coverUrl} alt=""/>
                <div className="commen-video-playcount"><i className="iconfont icon-triangle"></i>{item.playTime_format}</div>
                <div className="commen-video-duration">{item.duration_format}</div>
              </div>
              <div className="commen-video-text">{item.title}</div>
            </div>
          ))
        }
      </div>
    )
  }

  function genArtistDescContent () {
    return (
      <>
        {
          desc.map(item => (
            <>
              <div className="artist-desc-title">{item.ti}</div>
              <div className="artist-desc-content">{item.txt}</div>
            </>
          ))
        }
      </>
    )
  }

  function genArtistSimiContent () {
    return (
      <div className="commen-video-content">
        {
          simi.map(item => (
            <div key={item.id} className="commen-video-item commen-video-item-album">
              <div className="commen-video-img-wrap">
                <img src={item.img1v1Url} alt=""/>
              </div>
              <div className="commen-video-text">{item.name}</div>
            </div>
          ))
        }
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
        <span onClick={(e) => setTab('mv')} className={tab === 'mv' ? 'active' : ''}>MV</span>
        <span onClick={(e) => setTab('desc')} className={tab === 'desc' ? 'active' : ''}>歌手详情</span>
        <span onClick={(e) => setTab('simi')} className={tab === 'simi' ? 'active' : ''}>相似歌手</span>
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