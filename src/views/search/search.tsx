import React, { useEffect, useState } from 'react'
import './search.less'
import api from 'API/index'
import qs from 'qs'
import { useHistory } from 'react-router-dom'
import * as H from 'history'
import classnames from 'classnames'
import Song, { getSongList } from 'UTIL/song'
import Spin from 'COMPONENTS/spin/spin'
import MusicList from 'COMPONENTS/music-list/music-list'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import { AlbumBaseClass, createBaseAlbumList } from 'UTIL/album'
import { VideoBaseClass, createBaseVideoList} from 'UTIL/video'
import { PlaylistClass, createPlaylistList} from 'UTIL/playlist'
import { DjBaseClass, createBaseDjList } from 'UTIL/dj'
import { UserBaseClass, createBaseUserList } from 'UTIL/user'
import { useSongContextMenu } from 'UTIL/menu'
import { usePlayerController } from 'UTIL/player-controller'
import Pagination from 'COMPONENTS/pagination/pagination'
import { usePageForword } from 'ROUTER/hooks'
import Icon from 'COMPONENTS/icon/icon'
import { genArtists } from 'VIEWS/template/template'

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

interface PlaylistResult {
  tab: TabType.PLAYLIST
  result: PlaylistClass[]
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
  // [TabType.LYRIC]: '歌词',
  // [TabType.DJ]: '主播电台',
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
  [TabType.SONG]: 50,
  [TabType.ARTIST]: 20,
  [TabType.ALBUM]: 20,
  [TabType.VIDEO]: 20,
  [TabType.PLAYLIST]: 22,
  [TabType.LYRIC]: 20,
  [TabType.DJ]: 20,
  [TabType.USER]: 20
}

type SearchResult = SongResult | ArtistResult | AlbumResult | VideoResult | PlaylistResult | LyricResult | DjResult | UserResult
type ResultType = Song[] | ArtistBaseClass[] | AlbumBaseClass[] | VideoBaseClass[] | PlaylistClass[] | DjBaseClass[] | UserBaseClass[]

enum URLQueryStringKey {
  TAB = 'tab',
  KEYWORDS = 'keywords'
}

let offset = 0

const Search: React.SFC = () => {
  const keywords = getQueryStringValue(URLQueryStringKey.KEYWORDS) || ''
  const queryTab = getQueryStringValue(URLQueryStringKey.TAB)
  const [tab, setTab] = useState<TabType>(queryTab || TabType.SONG)
  const history = useHistory()
  const [result, setResult] = useState<ResultType>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const { getSongMenu } = useSongContextMenu()
  const { start } = usePlayerController()
  const [currentPage, setCurrentPage] = useState(1)
  const { goArtistDetail, goAlbumDetail, goUserDetail, goPlaylistDetail, goVideoDetail } = usePageForword()

  useEffect(() => {
    search()
  }, [tab, keywords])

  useEffect(() => {
    setLoading(true)
    setTab(queryTab)
  }, [queryTab])

  async function search () {
    const params = {
      limit: SEARCH_TAB_LIMIT_MAP[tab],
      type: SEARCH_TAB_PARAM_MAP[tab],
      keywords,
      offset
    }
    try {
      const res = await api.search(params)
      processResult(res, tab)
      if (tab !== TabType.SONG) {
        setLoading(false)
      }
    } catch (e) {}
  }

  function fixResult (result: any) {
    if (!Array.isArray(result)) {
      return []
    } else {
      return result
    }
  }

  function processResult (res: any, tab: TabType) {
    switch (tab) {
      case TabType.SONG:
        getSongList(fixResult(res.data.result.songs).map((item: any) => item.id))
          .then(songs => {
            setResult(songs)
            setLoading(false)
          })
        setTotal(res.data.result.songCount)
        break
      case TabType.ARTIST:
        setResult(createBaseArtistList(fixResult(res.data.result.artists)))
        setTotal(res.data.result.artistCount)
        break
      case TabType.ALBUM:
        setResult(createBaseAlbumList(fixResult(res.data.result.albums)))
        setTotal(res.data.result.albumCount)
        break
      case TabType.VIDEO:
        setResult(createBaseVideoList(fixResult(res.data.result.videos)))
        setTotal(res.data.result.videoCount)
        break
      case TabType.PLAYLIST:
        setResult(createPlaylistList(fixResult(res.data.result.playlists)))
        setTotal(res.data.result.playlistCount)
        break
      case TabType.DJ:
        setResult(createBaseDjList(fixResult(res.data.result.djRadios)))
        setTotal(res.data.result.djRadiosCount)
        break
      case TabType.USER:
        setResult(createBaseUserList(fixResult(res.data.result.userprofiles)))
        setTotal(res.data.result.userprofileCount)
        break
    }
  }

  function onTabSelect (currentTab: TabType) {
    if (tab === currentTab) return
    setLoading(true)
    setTab(currentTab)
    setQueryStringValue(URLQueryStringKey.TAB, currentTab, history)
  }

  function genSearchContent (search: SearchResult) {
    if (!search.result.length) {
      return <div styleName="search-no-data">很抱歉，未能找到与"<span>{keywords}</span>"相关的任何{SEARCH_TAB_NAME_MAP[tab]}。</div>
    }
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

  function getMenu (song: Song) {
    return getSongMenu({ id: `/search?keywords=${keywords}&tab=${tab}`, name: '搜索页' }, song)
  }

  function musiclistStart (song: Song) {
    start({ id: `/search?keywords=${keywords}&tab=${tab}`, name: '搜索页' }, song)
  }

  function genSearchSongContent (songs: Song[]) {
    return (
      <MusicList start={musiclistStart} getMenu={getMenu} list={songs}></MusicList>
    )
  }

  function genSearchArtistContent (artists: ArtistBaseClass[]) {
    return (
      <div styleName="search-content">
        {
          artists.map(artist => (
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

  function genSearchAlbumContent (albums: AlbumBaseClass[]) {
    return (
      <div styleName="search-content">
        <div className="commen-area-content">
          {
            albums.map(album => (
              <div onClick={() => goAlbumDetail(album.id) } className={`commen-area-item commen-item-album`}>
                <div className="commen-area-img-wrap">
                  <img className="commen-area-img" src={album.picUrl +'?param=250y250'} alt=""/>
                </div>
                <div className="commen-area-text line-more">{album.name}</div>
                <div className="commen-area-artist">{ genArtists(album.artists, goArtistDetail, 'commen-link-666666')}</div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }

  function genSearchVideoContent (videos: VideoBaseClass[]) {
    return (
      <div className="commen-area-content" styleName="search-content">
        {
          videos.map((video) => (
            <div key={video.vid} className="commen-area-item commen-area-item-large">
              <div onClick={() => { goVideoDetail(video.vid) }} className="commen-area-img-wrap">
                <img src={video.coverUrl+'?param=500y282'} alt=""/>
                <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{video.playTime_format}</div>
                <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                <div className="commen-area-duration">{video.duration_format}</div>
              </div>
              <div className="commen-area-text">{video.title}</div>
            </div>
          ))
        }
      </div>
    )
  }

  function genSearchPlaylistContent (playlists: PlaylistClass[]) {
    return (
      <div styleName="search-content">
        { playlists.map(playlist => (
            <div onClick={() => goPlaylistDetail(playlist.id, playlist) } className={`commen-area-item commen-area-item-playlist-130`}>
              <div className="commen-area-img-wrap">
                <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{playlist.playCount_string}</div>
                <img className="commen-area-img" src={playlist.coverImgUrl+'?param=250y250'} alt=""/>
                <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                <div className="commen-area-user" onClick={(e) => { e.stopPropagation(); goUserDetail(playlist.creator.userId) }}><Icon name="icon-user"></Icon>{playlist.creator.nickname}</div>
              </div>
              <div className="commen-area-text line-more">{playlist.name}</div>
            </div>
          ))}
      </div>
    )
  }

  function genSearchDjContent (djs: DjBaseClass[]) {
    return (
      <ul>
        {
          djs.map(dj => (
            <li styleName="search-artist-item" key={dj.id}>
              <img styleName="search-artist-item-avatar" src={dj.picUrl+'?param=60y60'} alt=""/>
              <span>{dj.name}</span>
            </li>
          ))
        }
      </ul>
    )
  }

  function genSearchUserContent (users: UserBaseClass[]) {
    return (
      <ul>
        {
          users.map(user => (
            <li styleName="search-artist-item" key={user.userId}>
              <img styleName="search-artist-item-avatar" src={user.avatarUrl+'?param=60y60'} alt=""/>
              <span>{user.nickname}</span>
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

  useEffect(() => {
    offset = 0
    setCurrentPage(1)
  }, [tab])

  function onPageChange (page: number) {
    setCurrentPage(page)
    offset = (page - 1) * SEARCH_TAB_LIMIT_MAP[tab]
    search()
  }

  return (
    <div styleName="search-container">
      <div styleName="search-keyword-wrap">
        <span styleName="search-keyword">{keywords}</span>
        <span styleName="search-keyword-num">{getSearchResultText()}</span>
      </div>
      <div styleName="search-tab">
        {
          (Object.keys(SEARCH_TAB_NAME_MAP) as TabType[]).map(key => (
            <span key={key} onClick={() => onTabSelect(key)} styleName={classnames('search-tab-item', {'active': key === tab})}>{SEARCH_TAB_NAME_MAP[key]}</span>
          ))
        }
      </div>
      <Spin loading={loading} delay={0}>
        { !loading && genSearchContent({ tab, result } as SearchResult)}
        {
          !loading && total >= SEARCH_TAB_LIMIT_MAP[tab] &&
          <div className="pagination-wrap">
            <Pagination currentPage={currentPage} total={total} pageSize={SEARCH_TAB_LIMIT_MAP[tab]} onChange={onPageChange}></Pagination>
          </div>
        }
      </Spin>
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