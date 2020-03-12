import React, { useState, useEffect } from 'react'
import api from 'API/index'
import './artist.less'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'

const GenderMap = {
  '01': '男歌手',
  '02': '女歌手',
  '03': '乐队组合'
}

const LangMap = {
  '10': '华语',
  '20': '欧美',
  '60': '日本',
  '70': '韩国',
  '40': '其他'
}

const InitialMap = ['热门', ...String.fromCharCode(...Array.from({ length: 25 }, (item, index) =>  index + 65))]

const Artist: React.SFC = () => {
  const [ artists, setArtists ] = useState<ArtistBaseClass[]>([])
  const [ gender, setGender ] = useState<keyof typeof GenderMap>('01')
  const [ initial, setInitial ] = useState<string>('热门')
  const [ lang, setLang ] = useState<keyof typeof LangMap>('10')
  const { goArtistDetail, goUserDetail } = usePageForword()

  useEffect(() => {
    getArtists()
  }, [gender, initial, lang])

  async function getArtists () {
    const cat = lang + gender
    const order = initial === '热门' ? '' : initial
    try {
      const params = {
        limit: 30,
        cat,
        initial: order,
        offset: 0
      }
      const res = await api.getArtist(params)
      setArtists(createBaseArtistList(res.data.artists))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="artist">
      <div className="artist-filter">
        <div className="artist-filter-item">
          <span>语种:</span>
          <div>
            {
              (Object.keys(LangMap) as (keyof typeof LangMap)[]).map(key => (
                <span key={key} onClick={() => setLang(key)} className={classnames({ 'active': key === lang })}>{LangMap[key]}</span>
              ))
            }
          </div>
        </div>
        <div className="artist-filter-item">
          <span>分类:</span>
          <div>
            {
              (Object.keys(GenderMap) as (keyof typeof GenderMap)[]).map(key => (
                <span key={key} onClick={() => setGender(key)} className={classnames({ 'active': key === gender })}>{GenderMap[key]}</span>
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
  )
}

export default Artist