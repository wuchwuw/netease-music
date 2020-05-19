import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import api from 'API/index'
import './artist.less'
import { createArtist, Artist as ArtistClass } from 'UTIL/artist'
import Song, { createSongList } from 'UTIL/song'
import { createAlbumList, Album } from 'UTIL/album'
import { padZero } from 'UTIL/util'
import { createArtistMVList, MV } from 'UTIL/mv'
import { createBaseArtistList, ArtistBaseClass } from 'UTIL/artist'
import top50 from 'ASSETS/images/top50.jpg'
import { usePageForword } from 'ROUTER/hooks'
import { usePlayerController } from 'UTIL/player-controller'
import { useFavorite } from 'UTIL/favorite'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { ContextMenuWrap, ConnectedMenu } from 'COMPONENTS/context-menu/context-menu'
import { useSongContextMenu } from 'UTIL/menu'

const MENU_NAME = 'music-list-contextmenu'
const Menu = ConnectedMenu(MENU_NAME)

interface ArtistDesc {
  ti: string
  txt: string
}

const ArtistTab = {
  album: '专辑',
  mv: 'MV',
  desc: '歌手详情',
  simi: '相似歌手'
}

type ArtistTabType = keyof typeof ArtistTab
let loading = false
let hasmore = true
const ARTIST_ALBUM_LIMIT = 6
let offset = 0

const Artist = () => {
  const { id } = useParams()
  const artistId = Number(id)
  const [ artist, setArtist ] = useState<ArtistClass>(createArtist({}))
  const [ tab, setTab ] = useState<ArtistTabType>('album')
  const [ hotSong, setHotSong ] = useState<Song[]>([])
  const [ albums, setAlbums ] = useState<Album[]>([])
  const [ mv, setMV ] = useState<MV[]>([])
  const [ desc, setDesc ] = useState<ArtistDesc[]>([])
  const [ simi, setSimi ] = useState<ArtistBaseClass[]>([])
  const [ showMore, setShowMore ] = useState(false)
  const { goAlbumDetail, goUserDetail, goArtistDetail } = usePageForword()
  const { start } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()
  const { getSongMenu } = useSongContextMenu()

  useEffect(() => {
    getArtistDetail()
    getArtistAlbum()
    getArtistMv()
    getArtistDesc()
    getArtistSimi()
  }, [artistId])

  useEffect(() => {
    setTab('album')
  }, [artistId])

  async function getArtistDetail () {
    try {
      const res = await api.getArtistDetail({ id: artistId })
      setArtist(createArtist(res.data.artist))
      setHotSong(createSongList(res.data.hotSongs))
    } catch (e) {}
  }

  async function getArtistAlbum () {
    try {
      loading = true
      const res = await api.getArtistAlbum({ id: artistId, limit: ARTIST_ALBUM_LIMIT, offset })
      const p = res.data.hotAlbums.map((item: any) => api.getAlbumContent({ id: item.id }))
      const allContents = await Promise.all(p)
      setAlbums(albums => albums.concat(createAlbumList(allContents.map((item: any) => {
        return { ...item.data.album, songs: item.data.songs }
      }))))
      offset += ARTIST_ALBUM_LIMIT
      hasmore = res.data.more
      loading = false
    } catch (e) { console.log(e) }
  }

  function loadmore () {
    if (loading) return
    if (!hasmore) return
    getArtistAlbum()
  }

  async function getArtistMv () {
    try {
      const res = await api.getArtistMV({ id: artistId })
      setMV(createArtistMVList(res.data.mvs))
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

  function playAlbum (song: Song, songs?: Song[]) {
    start({ id: `artist-${artist.id}`, name: artist.name}, song, songs)
  }

  function genArtistContent (tab: ArtistTabType) {
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

  function getMenu (song: Song) {
    return getSongMenu({ id: `playlist-${artist.id}`, name: artist.name }, song)
  }

  function genArtistAlbumContent () {
    return (
      <div>
        <div className="artist-album-item">
          <img className="artist-album-item-img" src={top50} alt=""/>
          <div className="artist-album-item-list">
            <div className="artist-album-name">
              热门50首
              <span><i onClick={() => { playAlbum(hotSong[0], hotSong) }} className="iconfont icon-play"></i><i className="iconfont icon-add-folder"></i></span>
            </div>
            {
              hotSong.slice(0, 10).map((song, index) => (
                <div className="artist-album-item-list-item-wrap">
                  <ContextMenuWrap id={MENU_NAME} menu={getMenu(song)} >
                    <div onDoubleClick={() => { playAlbum(song, hotSong) }} className="artist-album-item-list-item" key={song.id}>
                      <span>{padZero(index + 1)}</span>
                      <span><i onClick={() => { favorite(song.id) }} className={`iconfont ${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}></i></span>
                      <span>{song.name}</span>
                      <span>{song.duration_string}</span>
                    </div>
                  </ContextMenuWrap>
                </div>
              ))
            }
            {
              genAlbumMore(hotSong, 'more')
            }
          </div>
        </div>
        {
          albums.map(album => (
            <div key={album.id} className="artist-album-item">
              <div>
                <img onClick={() => { goAlbumDetail(album.id) }} className="artist-album-item-img" src={album.picUrl + '?param=200y200'} alt=""/>
                <div className="artist-album-time">{album.publishTimeFormat}</div>
              </div>
              <div className="artist-album-item-list">
                <div className="artist-album-name">
                  {album.name}
                  <span><i onClick={() => { playAlbum(album.songs[0], album.songs) }} className="iconfont icon-play"></i><i className="iconfont icon-add-folder"></i></span>
                </div>
                {
                  album.songs.slice(0, 10).map((song, index) => (
                    <div className="artist-album-item-list-item-wrap">
                      <ContextMenuWrap id={MENU_NAME} menu={getMenu(song)}>
                        <div onDoubleClick={() => { playAlbum(song, album.songs) }} className="artist-album-item-list-item" key={song.id}>
                          <span>{padZero(index + 1)}</span>
                          <span><i onClick={() => { favorite(song.id)}} className={`iconfont ${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}></i></span>
                          <span>{song.name}</span>
                          <span>{song.duration_string}</span>
                        </div>
                      </ContextMenuWrap>
                    </div>
                  ))
                }
                {
                  genAlbumMore(album.songs, 'detail', album.id)
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
      <div className="commen-area-content">
        {
          mv.map(item => (
            <div key={item.id} className="commen-area-item commen-area-item-large">
              <div className="commen-area-img-wrap">
                <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <img src={item.cover} alt=""/>
                <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_format}</div>
                <div className="commen-area-duration">{item.duration_format}</div>
              </div>
              <div className="commen-area-text">{item.name}</div>
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
      <div className="commen-area-content">
        {
          simi.map(item => (
            <div key={item.id} className="commen-area-item commen-area-item-album">
              <div onClick={() => { goArtistDetail(item.id) }} className="commen-area-img-wrap">
                <img src={item.img1v1Url + '?param=200y200'} alt=""/>
              </div>
              <div onClick={() => { goArtistDetail(item.id) }} className="commen-area-text">{item.name}</div>
            </div>
          ))
        }
      </div>
    )
  }

  function genAlbumMore (songs: Song[], type: string, albumId?: number) {
    if (songs.length <= 10) return null
    if (type === 'more') {
      return showMore ? (
        songs.slice(10).map((song, index) => (
          <div className="artist-album-item-list-item" key={song.id}>
            <span>{padZero(index + 11)}</span>
            <span><i className="iconfont iconxin"></i></span>
            <span>{song.name}</span>
            <span>{song.duration_string}</span>
          </div>
        ))
      )
      :
      <div className="artist-album-more"><span onClick={() => setShowMore(true)}>查看全部{songs.length}首<i className="iconfont icon-arrow"></i></span></div>
    } else if (type === 'detail') {
      return <div className="artist-album-more"><span onClick={() => { goAlbumDetail(albumId!) }}>查看全部<i className="iconfont icon-arrow"></i></span></div>
    }
  }

  return (
    <LoadMore load={loadmore}>
      <div className="artist-container">
        <div className="artist-info-wrap">
          <div className="artist-info-img" style={{backgroundImage: `url(${artist.img1v1Url + '?param=300y300'})`}}></div>
          <div className="artist-info">
            <span className="artist-info-name">{artist.name}</span>
            <div className="artist-info-other">
              <span>单曲数: {artist.musicSize}</span>
              <span>专辑数: {artist.albumSize}</span>
              <span>MV数: {artist.mvSize}</span>
            </div>
            <div className="artist-info-option">
              <span className="artist-info-option-star"><i className="iconfont icon-add-folder"></i>收藏</span>
              { artist.accountId && <span onClick={() => { goUserDetail(artist.accountId) }} className="artist-info-option-user"><i className="iconfont icon-user"></i>个人主页</span>}
            </div>
          </div>
        </div>
        <div className="playlist-tab">
          {
            (Object.keys(ArtistTab) as ArtistTabType[]).map(item => (
              <span onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{ ArtistTab[item] }</span>
            ))
          }
        </div>
        <div className="artist-tab-content">
          {
            genArtistContent(tab)
          }
          <Menu></Menu>
        </div>
      </div>
    </LoadMore>
  )
}

export default Artist