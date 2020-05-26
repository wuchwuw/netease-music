import React, { useState, useEffect, useCallback, useMemo } from 'react'
import api from 'API/index'
import './artist.less'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import LoadMore from 'COMPONENTS/load-more/load-more'

const GenderMap = {
  '全部': -1,
  '男歌手': 1,
  '女歌手': 2,
  '乐队组合': 3
}

const LangMap = {
  '全部': -1,
  '华语': 7,
  '欧美': 96,
  '日本': 8,
  '韩国': 16,
  '其他': 0
}

console.log(Object.keys(LangMap))

const InitialMap = ['热门', ...String.fromCharCode(...Array.from({ length: 25 }, (item, index) =>  index + 65)), '#']
const ARTIST_LIMIT = 30
let loading = false
let hasmore = true
let offset = 0

const Artist: React.SFC = () => {
  const [ artists, setArtists ] = useState<ArtistBaseClass[]>([])
  const [ gender, setGender ] = useState<keyof typeof GenderMap>('全部')
  const [ initial, setInitial ] = useState<string>('热门')
  const [ lang, setLang ] = useState<keyof typeof LangMap>('全部')
  const { goArtistDetail, goUserDetail } = usePageForword()

  useEffect(() => {
    loading = false
    hasmore = true
    offset = 0
    getArtists(false)
  }, [gender, initial, lang])

  async function getArtists (loadmore: boolean) {
    let order = ['热门', '#'].indexOf(initial)
    loading = true
    try {
      const params = {
        limit: ARTIST_LIMIT,
        type: GenderMap[gender],
        area: LangMap[lang],
        initial: order > -1 ? --order : initial,
        offset: offset
      }
      const res = await api.getArtist(params)
      loading = false
      hasmore = res.data.more
      !loadmore ? setArtists(createBaseArtistList(res.data.artists)) : setArtists(artists => artists.concat(createBaseArtistList(res.data.artists)))
    } catch (e) { console.log(e) }
  }

  function loadmore () {
    if (!hasmore) return
    if (loading) return
    offset = offset + ARTIST_LIMIT
    getArtists(true)
  }

  return (
    <LoadMore load={loadmore}>
      <div className="artist">
        <div className="artist-filter">
          <div className="artist-filter-item">
            <span>语种:</span>
            <div>
              {
                (Object.getOwnPropertyNames(LangMap) as (keyof typeof LangMap)[]).map(key => (
                  <span key={key} onClick={() => setLang(key)} className={classnames({ 'active': key === lang })}>{key}</span>
                ))
              }
            </div>
          </div>
          <div className="artist-filter-item">
            <span>分类:</span>
            <div>
              {
                (Object.keys(GenderMap) as (keyof typeof GenderMap)[]).map(key => (
                  <span key={key} onClick={() => setGender(key)} className={classnames({ 'active': key === gender })}>{key}</span>
                ))
              }
            </div>
          </div>
          <div className="artist-filter-item">
            <span>筛选:</span>
            <div>
              {
                InitialMap.map(item => (
                  <span key={item} onClick={() => setInitial(item)} className={classnames({ 'active': item === initial })}>{item}</span>
                ))
              }
            </div>
          </div>
        </div>
        <div className="artist-content">
          {
            artists.map(artist => (
              <div key={artist.id} className="artist-item">
                <img onClick={ () => { goArtistDetail(artist.id) } } src={artist.picUrl + '?param=250y250'} alt=""/>
                <div className="artist-item-info">
                  <span>{artist.name}</span>
                  { artist.accountId && <i onClick={ (e) => { e.stopPropagation(); goUserDetail(artist.accountId) } } className="iconfont icon-user"></i>}
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </LoadMore>
  )
}

export default Artist