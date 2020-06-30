import React, { useState, useEffect, ReactNode } from "react"
import './search.less'
import Spin from 'COMPONENTS/spin/spin'
import api from 'API/index'
import { usePageForword } from "ROUTER/hooks"
import { useSearchKeywords } from "UTIL/search-keywords"
import Song, { createSongList, getSongList } from "UTIL/song"
import { Album, createAlbumList } from "UTIL/album"
import { PlaylistClass, createPlaylistList } from "UTIL/playlist"
import { MV, createMVList } from "UTIL/mv"
import { Artist, createArtistList } from "UTIL/artist"
import { usePlayerController } from "UTIL/player-controller"

interface Suggest {
  songs: Song[]
  artists: Artist[]
  albums: Album[]
  mvs: MV[]
  playlists: PlaylistClass[]
  order: SuggestOrder
}
type SuggestOrder = ('songs' | 'albums' | 'mvs' | 'playlists' | 'artists')[]

const Search: React.SFC = () => {
  const [loading, setLoading] = useState(true)
  const [hot, setHot] = useState([])
  const [suggest, setSuggest] = useState<Suggest>({
    order: [],
    songs: [],
    artists: [],
    albums: [],
    mvs: [],
    playlists: []
  })
  const { goSearch } = usePageForword()
  const { keywords, historyKeywords, setKeywords, addKeywordsHistory, removeKeywordsHistory } = useSearchKeywords()
  const { goPlaylistDetail, goMVDetail, goArtistDetail, goAlbumDetail} = usePageForword()
  const { start } = usePlayerController()

  useEffect(() => {
    getHotKey()
  }, [])

  useEffect(() => {
    if (keywords) {
      getSearchSuggest()
    }
  }, [keywords])

  async function getHotKey () {
    try {
      setLoading(true)
      const { data: { result } } = await api.getHotKeyword()
      setHot(result.hots)
    } finally {
      setLoading(false)
    }
  }

  async function getSearchSuggest () {
    try {
      const res = await api.getSearchSuggest({ keywords })
      setSuggest(processSuggest(res.data.result))
    } catch (e) {}
  }

  function processSuggest (suggest: any): Suggest {
    let res: Suggest = {
      order: [],
      songs: [],
      artists: [],
      albums: [],
      mvs: [],
      playlists: []
    }
    if (!suggest.order) return res
    const order = res.order = suggest.order
    order.forEach((item: any) => {
      if (item === 'songs') {
        res.songs = createSongList(suggest.songs)
      } else if (item === 'artists') {
        res.artists = createArtistList(suggest.artists)
      } else if (item === 'albums') {
        res.albums = createAlbumList(suggest.albums)
      } else if (item === 'mvs') {
        res.mvs = createMVList(suggest.mvs)
      } else if (item === 'playlists') {
        res.playlists = createPlaylistList(suggest.playlists)
      }
    })

    return res
  }

  async function handleSuggestSong (song: Song) {
    try {
      const songs = await getSongList([song.id])
      songs.length && start({ name: '搜索页', id: `/search?keywords=${keywords}&tab=song` }, songs[0])
    } catch (e) {}
  }

  function genSuggestContent () {
    if (!suggest.order) return null

    let ret: ReactNode[] = []
    const order: SuggestOrder = suggest.order

    order.forEach((item) => {
      if (item === 'songs') {
        ret.push(
          <>
            <div className="search-suggest-title"><i className="iconfont icon-neteastmusic"></i>单曲</div>
            {
              suggest.songs.map(item => (
                <div onClick={() => { handleSuggestSong(item) }} key={item.id} className="search-suggest-item">{item.name} - {item.artists[0].name}</div>
              ))
            }
          </>
        )
      } else if (item === 'artists') {
        ret.push(
          <>
            <div className="search-suggest-title"><i className="iconfont icon-user"></i>歌手</div>
            {
              suggest.artists.map(item => (
                <div key={item.id} onClick={() => { goArtistDetail(item.id) }} className="search-suggest-item">{item.name}</div>
              ))
            }
          </>
        )
      } else if (item === 'albums') {
        ret.push(
          <>
            <div className="search-suggest-title"><i className="iconfont icon-playlist"></i>专辑</div>
            {
              suggest.albums.map(item => (
                <div key={item.id} onClick={() => { goAlbumDetail(item.id) }} className="search-suggest-item">{item.name} - {item.artists[0].name}</div>
              ))
            }
          </>
        )
      } else if (item === 'mvs') {
        ret.push(
          <>
            <div className="search-suggest-title"><i className="iconfont icon-mv"></i>视频</div>
            {
              suggest.mvs.map(item => (
                <div key={item.id} onClick={() => { goMVDetail(item.id) }} className="search-suggest-item">{item.name} - {item.artists[0].name}</div>
              ))
            }
          </>
        )
      } else if (item === 'playlists') {
        ret.push(
          <>
            <div className="search-suggest-title"><i className="iconfont icon-playlist"></i>歌单</div>
            {
              suggest.playlists.map(item => (
                <div key={item.id} onClick={() => { goPlaylistDetail(item.id) }} className="search-suggest-item">{item.name}</div>
              ))
            }
          </>
        )
      }
    })
    return ret
  }

  function onKeywordItemClick (keywords: string) {
    setKeywords(keywords)
    addKeywordsHistory(keywords)
    goSearch({ keywords, tab: 'song' })
  }

  function onSearchHistoryRemove (e: React.MouseEvent, history: string) {
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation();
    removeKeywordsHistory(history)
  }

  return (
    <div className="search-panel-container">
      {
        !keywords ? (
          <>
            <div className="search-panel-title">热门搜索</div>
            <Spin loading={loading} delay={0}>
              <div className="search-panel-keyword">
                {
                  hot.map((item: any) => (
                    <span onClick={() => { onKeywordItemClick(item.first) }} key={item.first}>{item.first}</span>
                  ))
                }
              </div>
            </Spin>
            <div className="search-panel-title">搜索历史</div>
            {
              historyKeywords.length ? (
                <div className="search-panel-keyword">
                  {
                    historyKeywords.map((item: any) => (
                      <span onClick={() => { onKeywordItemClick(item) }} key={item}>
                        {item}
                        <i onClick={(e) => { onSearchHistoryRemove(e, item) }} className="iconfont icon-close"></i>
                      </span>
                    ))
                  }
                </div>
              )
              :
              <div className="search-panel-keyword-nodata">暂无搜索历史</div>
            }
          </>
        ) :
        <>
          {
            genSuggestContent()
          }
        </>
      }
    </div>
  )
}

export default Search