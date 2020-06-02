import React, { useState, useEffect, ReactNode } from "react"
import './search.less'
import Spin from 'COMPONENTS/spin/spin'
import api from 'API/index'
import { useDispatch } from "react-redux"
import Song from 'UTIL/song'
import { usePageForword } from "ROUTER/hooks"
import { useSearchKeywords } from "UTIL/search-keywords"

interface SuggestArtist {
  id: number
  name: string
}

interface SuggestPlaylist {
  id: number
  name: string
}

interface SuggestAlbum {
  id: number
  name: string
}

const Search: React.SFC = () => {
  const [loading, setLoading] = useState(true)
  const [hot, setHot] = useState([])
  const [suggest, setSuggest] = useState<any>({})
  const { goSearch } = usePageForword()
  const { keywords, historyKeywords, setKeywords, addKeywordsHistory, removeKeywordsHistory } = useSearchKeywords()

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
      setSuggest(res.data.result)
    } catch (e) {}
  }

  function genSuggestContent () {
    if (!suggest.order) return null
    const order = suggest.order
    let ret: ReactNode[] = []
    order.forEach((item: any) => {
      if (item === 'songs') {
        ret.push(
        <>
          <div className="search-suggest-title"><i className="iconfont icon-neteastmusic"></i>单曲</div>
          {
            suggest.songs.map(item => (
              <div className="search-suggest-item">{item.name}-{item.artists[0].name}</div>
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
                <div className="search-suggest-item">{item.name}</div>
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
                <div className="search-suggest-item">{item.name}-{item.artist.name}</div>
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
                <div className="search-suggest-item">{item.name}-{item.artistName}</div>
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
                <div className="search-suggest-item">{item.name}</div>
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