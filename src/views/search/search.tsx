import React, { useEffect, useState, useMemo } from 'react'
import './search.less'
import api from 'API/index'
import qs from 'qs'
import { useHistory } from 'react-router-dom'
import * as H from 'history'
import classnames from 'classnames'
import Song, { createSongList } from 'UTIL/song'
import Spin from 'COMPONENTS/spin/spin'
import MusicList from 'COMPONENTS/music-list/music-list'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import { AlbumBaseClass, createBaseAlbumList } from 'UTIL/album'
import { VideoBaseClass, createBaseVideoList} from 'UTIL/video'
import { PlaylistBaseClass, createBasePlaylist} from 'UTIL/playlist'
import { DjBaseClass, createBaseDjList } from 'UTIL/dj'
import { UserBaseClass, createBaseUserList } from 'UTIL/user'

enum TabType {
  SONG = 'song',
  ARTIST = 'artist',
  ALBUM = 'album',
  VIDEO = 'video',
  PLAYLIST = 'playlist',
  LYRIC = 'lyric',
  DJ = 'dj',
  USER = 'user'
}

interface SongResult {
  tab: TabType.SONG
  result: Song[]
}

interface ArtistResult {
  tab: TabType.ARTIST
  result: ArtistBaseClass[]
}

interface AlbumResult {
  tab: TabType.ALBUM
  result: AlbumBaseClass[]
}

interface VideoResult {
  tab: TabType.VIDEO
  result: VideoBaseClass[]
}

interface PlaylistSTResult {
  tab: TabType.PLAYLIST
  result: PlaylistBaseClass[]
}

interface LyricResult {
  tab: TabType.LYRIC
  result: string[]
}

interface DjResult {
  tab: TabType.DJ
  result: DjBaseClass[]
}

interface UserResult {
  tab: TabType.USER
  result: UserBaseClass[]
}

const SEARCH_TAB_NAME_MAP = {
  [TabType.SONG]: '单曲',
  [TabType.ARTIST]: '歌手',
  [TabType.ALBUM]: '专辑',
  [TabType.VIDEO]: '视频',
  [TabType.PLAYLIST]: '歌单',
  [TabType.LYRIC]: '歌词',
  [TabType.DJ]: '主播电台',
  [TabType.USER]: '用户'
}

const SEARCH_TAB_PARAM_MAP = {
  [TabType.SONG]: 1,
  [TabType.ARTIST]: 100,
  [TabType.ALBUM]: 10,
  [TabType.VIDEO]: 1014,
  [TabType.PLAYLIST]: 1000,
  [TabType.LYRIC]: 1006,
  [TabType.DJ]: 1009,
  [TabType.USER]: 1002
}

const SEARCH_TAB_LIMIT_MAP = {
  [TabType.SONG]: 100,
  [TabType.ARTIST]: 20,
  [TabType.ALBUM]: 20,
  [TabType.VIDEO]: 20,
  [TabType.PLAYLIST]: 22,
  [TabType.LYRIC]: 20,
  [TabType.DJ]: 20,
  [TabType.USER]: 20
}

type SearchResult = SongResult | ArtistResult | AlbumResult | VideoResult | PlaylistSTResult | LyricResult | DjResult | UserResult
type ResultType = Song[] | ArtistBaseClass[] | AlbumBaseClass[] | VideoBaseClass[] | PlaylistBaseClass[] | DjBaseClass[] | UserBaseClass[]

enum URLQueryStringKey {
  TAB = 'tab',
  KEYWORDS = 'keywords'
}

const Search: React.SFC = () => {
  const keywords = getQueryStringValue(URLQueryStringKey.KEYWORDS) || ''
  const [tab, setTab] = useState<TabType>(getQueryStringValue(URLQueryStringKey.TAB) || TabType.SONG)
  const history = useHistory()
  const [result, setResult] = useState<ResultType>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    search()
  }, [tab])

  async function search () {
    const params = {
      limit: SEARCH_TAB_LIMIT_MAP[tab],
      type: SEARCH_TAB_PARAM_MAP[tab],
      keywords
    }
    try {
      const res = await api.search(params)
      processResult(res, tab)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
  }

  function processResult (res: any, tab: TabType) {
    switch (tab) {
      case TabType.SONG:
        setResult(createSongList(res.data.result.songs))
        setTotal(res.data.result.songCount)
        return
      case TabType.ARTIST:
        setResult(createBaseArtistList(res.data.result.artists))
        setTotal(res.data.result.artistCount)
        return
      case TabType.ALBUM:
        setResult(createBaseAlbumList(res.data.result.albums))
        setTotal(res.data.result.albumCount)
        return
      case TabType.VIDEO:
        setResult(createBaseVideoList(res.data.result.videos))
        setTotal(res.data.result.videoCount)
        return
      case TabType.PLAYLIST:
        setResult(createBasePlaylist(res.data.result.playlists))
        setTotal(res.data.result.playlistCount)
        return
      case TabType.DJ:
        setResult(createBaseDjList(res.data.result.djRadios))
        setTotal(res.data.result.djRadiosCount)
        return
      case TabType.USER:
        setResult(createBaseUserList(res.data.result.userprofiles))
        setTotal(res.data.result.userprofileCount)
        return
    }
  }

  function onTabSelect (currentTab: TabType) {
    if (tab === currentTab) return
    setTab(currentTab)
    setLoading(true)
    setQueryStringValue(URLQueryStringKey.TAB, currentTab, history)
  }

  function genSearchContent (search: SearchResult) {
    switch (search.tab) {
      case TabType.SONG:
        return genSearchSongContent(search.result)
      case TabType.ARTIST:
        return genSearchArtistContent(search.result)
      case TabType.ALBUM:
        return genSearchAlbumContent(search.result)
      case TabType.VIDEO:
        return genSearchVideoContent(search.result)
      case TabType.PLAYLIST:
        return genSearchPlaylistContent(search.result)
      case TabType.DJ:
        return genSearchDjContent(search.result)
      case TabType.USER:
        return genSearchUserContent(search.result)
    }
  }

  function genSearchSongContent (songs: Song[]) {
    return (
      <div className="search-song-content">
        <MusicList list={songs}></MusicList>
      </div>
    )
  }

  function genSearchArtistContent (artists: ArtistBaseClass[]) {
    return (
      <ul className="search-artist-content">
        {
          artists.map(artist => (
            <li className="search-artist-item" key={artist.id}>
              <img className="search-artist-item-avatar" src={artist.picUrl+'?param=60y60'} alt=""/>
              <span className="search-artist-item-name">{artist.name}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genSearchAlbumContent (albums: AlbumBaseClass[]) {
    return (
      <ul className="search-artist-content">
        {
          albums.map(album => (
            <li className="search-artist-item" key={album.id}>
              <img className="search-artist-item-avatar" src={album.picUrl+'?param=60y60'} alt=""/>
              <span className="search-artist-item-name">{album.name}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genSearchVideoContent (videos: VideoBaseClass[]) {
    return (
      <div className="search-video-content">
        { videos.map(video => (
          <div key={video.vid} className="search-video-item">
            <div className="search-video-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
            <img className="search-video-img" src={video.coverUrl+'?param=230y130'} alt=""/>
            <div className="search-video-text text-overflow">{video.title}</div>
            {/* <div className="home-mv-artist text-overflow">{video.artistName}</div> */}
          </div>
        ))}
      </div>
    )
  }

  function genSearchPlaylistContent (playlists: PlaylistBaseClass[]) {
    return (
      <ul className="search-artist-content">
        {
          playlists.map(playlist => (
            <li className="search-artist-item" key={playlist.id}>
              <img className="search-artist-item-avatar" src={playlist.getCoverImgUrl('60y60')} alt=""/>
              <span className="search-artist-item-name">{playlist.name}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genSearchDjContent (djs: DjBaseClass[]) {
    return (
      <ul className="search-artist-content">
        {
          djs.map(dj => (
            <li className="search-artist-item" key={dj.id}>
              <img className="search-artist-item-avatar" src={dj.picUrl+'?param=60y60'} alt=""/>
              <span className="search-artist-item-name">{dj.name}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genSearchUserContent (users: UserBaseClass[]) {
    return (
      <ul className="search-artist-content">
        {
          users.map(user => (
            <li className="search-artist-item" key={user.userId}>
              <img className="search-artist-item-avatar" src={user.avatarUrl+'?param=60y60'} alt=""/>
              <span className="search-artist-item-name">{user.nickname}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function getSearchResultText () {
    if (total === 0) return ''
    switch (tab) {
      case TabType.SONG:
        return `找到 ${total} 首单曲`
      case TabType.ARTIST:
        return `找到 ${total} 位歌手`
      case TabType.ALBUM:
        return `找到 ${total} 张专辑`
      case TabType.VIDEO:
        return `找到 ${total} 个视频`
      case TabType.PLAYLIST:
        return `找到 ${total} 个歌单`
      case TabType.LYRIC:
        return `找到 ${total} 首歌词`
      case TabType.DJ:
        return `找到 ${total} 个电台`
      case TabType.USER:
        return `找到 ${total} 位用户`
    }
  }

  return (
    <div className="search-container">
      <div className="search-keyword-wrap">
        <span className="search-keyword">陈奕迅</span>
        <span className="search-keyword-num">{getSearchResultText()}</span>
      </div>
      <div className="search-tab">
        {
          (Object.keys(SEARCH_TAB_NAME_MAP) as TabType[]).map(key => (
            <span key={key} onClick={() => onTabSelect(key)} className={classnames('search-tab-item', {'active': key === tab})}>{SEARCH_TAB_NAME_MAP[key]}</span>
          ))
        }
      </div>
      <div className="search-content">
        <Spin loading={loading} delay={200}>
          {!loading && genSearchContent({ tab, result } as SearchResult)}
        </Spin>
      </div>
    </div>
  )
}

const getQueryStringValue = (key: URLQueryStringKey, queryString = window.location.search) => {
  const values = qs.parse(queryString ? queryString.substring(1) : queryString)
  return values[key]
}
const setQueryStringValue = (key: URLQueryStringKey, value: any, history: H.History, queryString = window.location.search) => {
  const values = qs.parse(queryString ? queryString.substring(1) : queryString)
  const newSearch = qs.stringify({ ...values, [key]: value })
  history.push(`${location.pathname}?${newSearch}`)
}

export default Search