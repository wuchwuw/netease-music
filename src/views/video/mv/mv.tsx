import React, { useState, useEffect } from 'react'
import api from 'API/index'
import './mv.less'
import { createMVList, MV } from 'UTIL/mv'
import classnames from 'classnames'
import Spin from 'COMPONENTS/spin/spin'
import Icon from 'COMPONENTS/icon/icon'
import { usePageForword } from 'ROUTER/hooks'
import { genArtists } from 'VIEWS/template/template'

const MV_CATE = ['内地', '港台', '欧美', '日本', '韩国']

const MvRecomend: React.SFC = () => {
  const [newMv, setNewMv] = useState<MV[]>([])
  const [exclusiveMv, setExclusiveMv] = useState<MV[]>([])
  const [toplist, setToplist] = useState<MV[]>([])
  const [hotMv, setHotMv] = useState<MV[]>([])
  const [newMVCate, setNewMVCate] = useState('内地')
  const [toplistCate, setToplistCate] = useState('内地')
  const [newLoading, setNewLoading] = useState(true)
  const [exclusiveLoading, setExclusiveLoading] = useState(true)
  const [toplistLoading, setToplistLoading] = useState(true)
  const [hotLoading, setHotLoading] = useState(true)
  const { goAllMV, goArtistDetail } = usePageForword()

  useEffect(() => {
    getExclusiveMv()
    getAllMv()
  }, [])

  useEffect(() => {
    getNewMv()
  }, [newMVCate])

  useEffect(() => {
    getMvToplist()
  }, [toplistCate])

  async function getNewMv () {
    try {
      newLoading && setNewLoading(true)
      const res = await api.getNewMv({ limit: 6, area: newMVCate })
      setNewMv(createMVList(res.data.data))
      setNewLoading(false)
    } catch (e) {}
  }

  async function getExclusiveMv () {
    try {
      setExclusiveLoading(true)
      const res = await api.getExclusiveMv({ limit: 6 })
      setExclusiveMv(createMVList(res.data.data))
      setExclusiveLoading(false)
    } catch (e) {}
  }

  async function getMvToplist () {
    try {
      toplistLoading && setToplistLoading(true)
      const res = await api.getMvToplist({ limit: 10, area: toplistCate })
      setToplist(createMVList(res.data.data))
      setToplistLoading(false)
    } catch (e) {}
  }

  async function getAllMv () {
    try {
      setHotLoading(true)
      const res = await api.getAllMv({ limit: 6, area: '全部', type: '全部', order: '最热' })
      setHotMv(createMVList(res.data.data))
      setHotLoading(false)
    } catch (e) {}
  }

  function genMVContent (mvs: MV[]) {
    return <>
      {
        mvs.map(mv => (
          <div key={mv.id} className="commen-area-item commen-area-item-large">
            <div className="commen-area-img-wrap">
              <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{mv.playCount_format}</div>
              <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
              <img src={mv.cover + '?param=500y282'} alt=""/>
            </div>
            <div className="commen-area-text text-overflow">{mv.name}</div>
            <div className="commen-area-artist text-overflow">{genArtists(mv.artists, goArtistDetail, 'commen-link-999999')}</div>
          </div>
        ))
      }
    </>
  }

  return (
    <div styleName="video-mv-container">
      <div styleName="video-mv-title">
        <span onClick={() => goAllMV({ order: '最新' }) }>最新MV<Icon name="icon-arrow-right" fontSize={18}></Icon></span>
        <div className="commen-filter-item">
          {
            MV_CATE.map(item => (
              <span key={item} onClick={() => { setNewMVCate(item) }} className={classnames({'active': newMVCate === item})}>{item}</span>
            ))
          }
        </div>
      </div>
      <div styleName="video-mv-content">
        <Spin loading={newLoading} delay={300}>
          <div className="commen-area-content">
            { genMVContent(newMv) }
          </div>
        </Spin>
      </div>
      <div styleName="video-mv-title">
        <span onClick={() => goAllMV({ order: '最热' }) }>热播MV<Icon name="icon-arrow-right" fontSize={18}></Icon></span>
      </div>
      <div styleName="video-mv-content">
        <Spin loading={hotLoading} delay={300}>
          <div className="commen-area-content">
            { genMVContent(hotMv) }
          </div>
        </Spin>
      </div>
      <div styleName="video-mv-title">
        <span onClick={() => goAllMV({ type: '网易出品', order: '最新' }) }>网易出品<Icon name="icon-arrow-right" fontSize={18}></Icon></span>
      </div>
      <div className="video-mv-content">
        <Spin loading={exclusiveLoading} delay={300}>
          <div className="commen-area-content">
            { genMVContent(exclusiveMv) }
          </div>
        </Spin>
      </div>
      <div styleName="video-mv-title">
        <span>MV排行榜<Icon name="icon-arrow-right" fontSize={18}></Icon></span>
        <div className="commen-filter-item">
          {
            MV_CATE.map(item => (
              <span key={item} onClick={() => { setToplistCate(item) }} className={classnames({'active': toplistCate === item})}>{item}</span>
            ))
          }
        </div>
      </div>
      <div styleName="video-mv-content">
        <Spin loading={toplistLoading} delay={300}>
          <div styleName="video-mv-toplist">
            {
              toplist.map((mv, index) => (
                <div key={mv.id} styleName="video-mv-toplist-item ">
                  <span styleName="video-mv-toplist-index">{index + 1}</span>
                  <img styleName="video-mv-toplist-img" src={mv.cover + '?param=230y130'} alt=""/>
                  <div styleName="video-mv-toplist-info">
                    <div styleName="video-mv-toplist-name">{mv.name}</div>
                    <div styleName="video-mv-toplist-artist">{genArtists(mv.artists, goArtistDetail, 'commen-link-999999')}</div>
                  </div>
                </div>
              ))
            }
          </div>
        </Spin>
        </div>
    </div>
  )
}

export default MvRecomend