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
import notificationApi from 'COMPONENTS/notification'
import { createAddPlaylistSongDialog } from 'COMPONENTS/dialog/create'
import { useUserPlaylist } from 'UTIL/user-playlist'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'

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
  const { goAlbumDetail, goUserDetail, goArtistDetail, goMVDetail } = usePageForword()
  const { start, currentSong } = usePlayerController()
  const { isFavorite, favorite } = useFavorite()
  const { getSongMenu } = useSongContextMenu()
  const openAddPlaylistSongDialog = createAddPlaylistSongDialog()
  const { userPlaylist, addOrRemoveSong } = useUserPlaylist()

  useEffect(() => {
    return () => {
      offset = 0
      hasmore = true
      loading = false
    }
  }, [])

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

  async function artistSub () {
    try {
      const t = artist.followed ? 2 : 1
      await api.artistSub({ t, id: artist.id })
      notificationApi.success({ content: artist.followed ? '已取消收藏' : '收藏成功' })
      getArtistDetail()
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
    return getSongMenu({ id: `/artist/${artist.id}`, name: artist.name }, song)
  }

  function genArtistAlbumContent () {
    return (
      <div>
        <div styleName="artist-album-item">
          <img styleName="artist-album-item-img" src={top50} alt=""/>
          <div styleName="artist-album-item-list">
            <div styleName="artist-album-name">
              热门50首
              <span>
                <Icon onClick={() => { playAlbum(hotSong[0], hotSong) }} name="icon-play"></Icon>
                <Icon onClick={() => { openAddPlaylistSongDialog({ songs: hotSong, userPlaylist, addOrRemoveSong }) }} name="icon-add-folder"></Icon>
              </span>
            </div>
            {
              hotSong.slice(0, 10).map((song, index) => (
                <div styleName="artist-album-item-list-item-wrap" key={song.id}>
                  <ContextMenuWrap id={MENU_NAME} menu={getMenu(song)} >
                    <div onDoubleClick={() => { playAlbum(song, hotSong) }} styleName="artist-album-item-list-item">
                      <span>{ currentSong.song.id === song.id ? <Icon name="icon-sound" className="icon-color-main"></Icon> : padZero(index + 1)}</span>
                      <span>
                        <Icon
                          onClick={() => { favorite(song.id) }}
                          name={`${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}
                          className={`icon-color-${isFavorite(song.id) ? 'main' : '9'} hover`}
                        >
                        </Icon>
                      </span>
                      <span>
                        {song.name}<span styleName="artist-album-item-alia">{song.alia_string}</span>
                        { song.isHighQuality && <span className="icon-music-highquality">SQ</span> }
                        { !!song.mv && <Icon onClick={() => { goMVDetail(song.mv) }} name="icon-mv" className="icon-color-main hover"></Icon> }
                      </span>
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
            <div key={album.id} styleName="artist-album-item">
              <div>
                <img onClick={() => { goAlbumDetail(album.id) }} styleName="artist-album-item-img" src={album.picUrl + '?param=200y200'} alt=""/>
                <div styleName="artist-album-time">{album.publishTimeFormat}</div>
              </div>
              <div styleName="artist-album-item-list">
                <div styleName="artist-album-name">
                  {album.name}
                  <span>
                    <Icon onClick={() => { playAlbum(album.songs[0], album.songs) }} name="icon-play"></Icon>
                    <Icon onClick={() => { openAddPlaylistSongDialog({ songs: album.songs, userPlaylist, addOrRemoveSong  }) }} name="icon-add-folder"></Icon>
                  </span>
                </div>
                {
                  album.songs.slice(0, 10).map((song, index) => (
                    <div styleName="artist-album-item-list-item-wrap" key={song.id}>
                      <ContextMenuWrap id={MENU_NAME} menu={getMenu(song)}>
                        <div onDoubleClick={() => { playAlbum(song, album.songs) }} styleName="artist-album-item-list-item">
                          <span>{ currentSong.song.id === song.id ? <Icon name="icon-sound" className="icon-color-main"></Icon> : padZero(index + 1)}</span>
                          <span>
                          <Icon
                            onClick={() => { favorite(song.id) }}
                            name={`${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}
                            className={`icon-color-${isFavorite(song.id) ? 'main' : '9'} hover`}
                          >
                          </Icon>
                          </span>
                          <span>
                            {song.name}<span styleName="artist-album-item-alia">{song.alia_string}</span>
                            { song.isHighQuality && <span className="icon-music-highquality">SQ</span> }
                            { !!song.mv && <Icon onClick={() => { goMVDetail(song.mv) }} name="icon-mv" className="icon-color-main hover"></Icon> }
                          </span>
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
        { mv.map(item => (
          <div key={item.id} className="commen-area-item commen-area-item-170x95">
            <div onClick={() => { goMVDetail(item.id) }} className="commen-area-img-wrap">
              <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{item.playCount_format}</div>
              <img className="commen-area-img" src={item.cover+'?param=500y282'} alt=""/>
              <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
            </div>
            <div onClick={() => { goMVDetail(item.id) }} className="commen-area-text">{item.name}</div>
          </div>
        ))}
      </div>
    )
  }

  function genArtistDescContent () {
    return (
      <>
        {
          desc.map(item => (
            <div key={item.ti}>
              <div styleName="artist-desc-title">{item.ti}</div>
              <div styleName="artist-desc-content">{item.txt}</div>
            </div>
          ))
        }
      </>
    )
  }

  function genArtistSimiContent () {
    return (
      <div className="commen-area-content">
        {
          simi.map(artist => (
            <div key={artist.id} className="commen-item-artist">
              <img onClick={ () => { goArtistDetail(artist.id) } } src={artist.img1v1Url + '?param=250y250'} alt=""/>
              <div className="commen-item-artist-info">
                <span className="commen-link-333333 active">{artist.name}</span>
                { artist.accountId && <Icon onClick={ (e) => { e.stopPropagation(); goUserDetail(artist.accountId) } } name="icon-user"></Icon>}
              </div>
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
          <div styleName="artist-album-item-list-item-wrap" key={song.id}>
            <ContextMenuWrap id={MENU_NAME} menu={getMenu(song)} >
              <div onDoubleClick={() => { playAlbum(song, hotSong) }} styleName="artist-album-item-list-item">
                <span>{ currentSong.song.id === song.id ? <Icon name="icon-sound" className="icon-color-main"></Icon> : padZero(index + 1)}</span>
                <span>
                  <Icon
                    onClick={() => { favorite(song.id) }}
                    name={`${isFavorite(song.id) ? 'icon-heart-full' : 'iconxin'}`}
                    className={`icon-color-${isFavorite(song.id) ? 'main' : '9'} hover`}
                  >
                  </Icon>
                </span>
                <span>
                  {song.name}<span styleName="artist-album-item-alia">{song.alia_string}</span>
                  { song.isHighQuality && <span className="icon-music-highquality">SQ</span> }
                  { !!song.mv && <Icon onClick={() => { goMVDetail(song.mv) }} name="icon-mv" className="icon-color-main hover"></Icon> }
                </span>
                <span>{song.duration_string}</span>
              </div>
            </ContextMenuWrap>
          </div>
        ))
      )
      :
      <div styleName="artist-album-more"><span onClick={() => setShowMore(true)}>查看全部{songs.length}首<Icon name="icon-arrow-right"></Icon></span></div>
    } else if (type === 'detail') {
      return <div styleName="artist-album-more"><span onClick={() => { goAlbumDetail(albumId!) }}>查看全部<Icon name="icon-arrow-right"></Icon></span></div>
    }
  }

  return (
    <LoadMore load={loadmore}>
      <div styleName="artist-container">
        <div styleName="artist-info-wrap">
          <div styleName="artist-info-img" style={{backgroundImage: `url(${artist.img1v1Url + '?param=300y300'})`}}></div>
          <div styleName="artist-info">
            <div styleName="artist-info-name">{artist.name}</div>
            <div styleName="artist-info-other">
              <span>单曲数: {artist.musicSize}</span>
              <span>专辑数: {artist.albumSize}</span>
              <span>MV数: {artist.mvSize}</span>
            </div>
            <div styleName="artist-info-option">
              <Button icon={<Icon name="icon-star"></Icon>} onClick={() => { artistSub() }}>
                {artist.followed ? '已收藏' : '收藏'}
              </Button>
              { artist.accountId && <Button icon={<Icon name="icon-user"></Icon>} onClick={() => { goUserDetail(artist.accountId) }}>个人主页</Button>}
            </div>
          </div>
        </div>
        <div className="playlist-tab">
          {
            (Object.keys(ArtistTab) as ArtistTabType[]).map(item => (
              <span key={item} onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>{ ArtistTab[item] }</span>
            ))
          }
        </div>
        <div styleName="artist-tab-content">
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