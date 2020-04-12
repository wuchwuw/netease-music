import React, { useState, useEffect, ReactNode } from "react"
import './search.less'
import Spin from 'COMPONENTS/spin/spin'
import api from 'API/index'
import { useSelector } from "react-redux"
import { RootState } from "STORE/index"
import Song from 'UTIL/song'

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
  const historyKeywords = useSelector((state: RootState) => state.commen.historyKeywords)
  const keyword = useSelector((state: RootState) => state.commen.keyword)
  const [suggest, setSuggest] = useState<any>({})

  useEffect(() => {
    getHotKey()
  }, [])

  useEffect(() => {
    if (keyword) {
      getSearchSuggest()
    }
  }, [keyword])

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
      const res = await api.getSearchSuggest({ keywords: keyword })
      setSuggest(res.data.result)
      console.log(res)
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

  return (
    <div className="search-panel-container">
      {
        !keyword ? (
          <>
            <div className="search-panel-title">热门搜索</div>
            <Spin loading={loading} delay={300}>
              <div className="search-panel-keyword">
                {
                  hot.map((item: any) => (
                    <span key={item.first}>{item.first}</span>
                  ))
                }
              </div>
            </Spin>
            <div className="search-panel-title">搜索历史</div>
            <div className="search-panel-keyword">
              {
                historyKeywords.map((item: any) => (
                  <span key={item}>{item}</span>
                ))
              }
            </div>
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