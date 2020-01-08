import React, { useEffect, useState } from 'react'
import './search.less'
import api from 'API/index'
import qs from 'qs'
import { useHistory } from 'react-router-dom'
import * as H from 'history'
import classnames from 'classnames'
import Song, { createSongList } from 'UTIL/song'
import Spin from 'COMPONENTS/spin/spin'

const SEARCH_TAB_TYPE_MAP = {
  song: '单曲',
  artist: '歌手',
  album: '专辑',
  video: '视频',
  playlist: '歌单',
  lyric: '歌词',
  dj: '主播电台',
  user: '用户'
}

const SEARCH_TAB_PARAM_MAP = {
  song: 1,
  artist: 100,
  album: 10,
  video: 1014,
  playlist: 1000,
  lyric: 1006,
  dj: 1009,
  user: 1002
}

type TabType = keyof typeof SEARCH_TAB_PARAM_MAP

type SearchResultType = Song[] | string[]

enum URLQueryStringKey {
  TAB = 'tab',
  KEYWORDS = 'keywords'
}

const Search: React.SFC = () => {
  const keywords = getQueryStringValue(URLQueryStringKey.KEYWORDS) || ''
  const [tab, setTab] = useState<TabType>(getQueryStringValue(URLQueryStringKey.TAB) || 'song')
  const history = useHistory()
  const [result, setResult] = useState<SearchResultType>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    search()
  }, [keywords, tab])

  async function search () {
    const params = {
      limit: 100,
      type: SEARCH_TAB_PARAM_MAP[tab],
      keywords
    }
    try {
      const res = await api.search(params)
      processResult(res, tab)
    } catch (e) {}
  }

  function processResult (res: any, tab: TabType) {
    switch (tab) {
      case 'song':
        setResult(createSongList(res.result.songs))
        setCount(res.result.songCount)
    }
  }

  function onTabSelect (tab: TabType) {
    setTab(tab)
    setQueryStringValue(URLQueryStringKey.TAB, tab, history)
  }

  return (
    <div className="search-container">
      <div className="search-keyword-wrap">
        <span className="search-keyword">陈奕迅</span>
        <span className="search-keyword-num">找到 0 首单曲</span>
      </div>
      <div className="search-tab">
        {
          (Object.keys(SEARCH_TAB_TYPE_MAP) as TabType[]).map(key => (
            <span key={key} onClick={() => onTabSelect(key)} className={classnames('search-tab-item', {'active': key === tab})}>{SEARCH_TAB_TYPE_MAP[key]}</span>
          ))
        }
      </div>
      <div className="search-content">
        <Spin loading={loading} delay={200}>
          {genSearchContent(tab, result)}
        </Spin>
      </div>
      <div className="search-multimatch-wrap">
        <span className="search-multimatch-title">最佳匹配</span>
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

function genSearchContent (tab: TabType, result: SearchResultType) {
  switch (tab) {
    case 'song':
      return genSearchSongContent(result)
  }
}

function genSearchSongContent (songs: Song[]) {
  return (
    <div className="search-song-content"></div>
  )
}


export default Search