import React, { useState, useEffect } from 'react'
import api from 'API/index'
import './mv.less'

const MvRecomend: React.SFC = () => {
  const [newMv, setNewMv] = useState([])
  const [exclusiveMv, setExclusiveMv] = useState([])
  const [toplist, setToplist] = useState([])
  const [hotMv, setHotMv] = useState([])

  useEffect(() => {
    getMv()
  }, [])

  async function getMv () {
    try {
      const res = await Promise.all([
        api.getNewMv({ limit: 6 }),
        api.getExclusiveMv({ limit: 6 }),
        api.getMvToplist({ limit: 10 }),
        api.getAllMv({ limit: 6, area: '全部', type: '全部', order: '最热' })
      ])
      setNewMv(res[0].data.data)
      setExclusiveMv(res[1].data.data)
      setToplist(res[2].data.data)
      setHotMv(res[3].data.data)
    } catch (e) {}
  }

  return (
    <div className="video-mv-container">
      <div className="video-mv-title">
        <span>最新MV<i className="iconfont icon-arrow home-icon-arrow"></i></span>
        <div className="commen-filter-item">
          <span>内地</span>
          <span>港台</span>
          <span>日本</span>
          <span>欧美</span>
          <span>韩国</span>
        </div>
      </div>
      <div className="commen-area-content">
        {
          newMv.map(mv => (
            <div key={mv.id} className="commen-area-item commen-area-item-large">
              <img src={mv.cover + '?param=230y130'} alt=""/>
              <div className="commen-area-text text-overflow">{mv.name}</div>
              <div className="commen-area-artist text-overflow">{mv.artistName}</div>
            </div>
          ))
        }
      </div>
      <div className="video-mv-title">
        <span>热播MV<i className="iconfont icon-arrow home-icon-arrow"></i></span>
      </div>
      <div className="commen-area-content">
        {
          hotMv.map(mv => (
            <div key={mv.id} className="commen-area-item commen-area-item-large">
              <img src={mv.cover + '?param=230y130'} alt=""/>
              <div className="commen-area-text text-overflow">{mv.name}</div>
              <div className="commen-area-artist text-overflow">{mv.artistName}</div>
            </div>
          ))
        }
      </div>
      <div className="video-mv-title">
        <span>网易出品<i className="iconfont icon-arrow home-icon-arrow"></i></span>
      </div>
      <div className="commen-area-content">
        {
          exclusiveMv.map(mv => (
            <div key={mv.id} className="commen-area-item commen-area-item-large">
              <img src={mv.cover + '?param=230y130'} alt=""/>
              <div className="commen-area-text text-overflow">{mv.name}</div>
              <div className="commen-area-artist text-overflow">{mv.artistName}</div>
            </div>
          ))
        }
      </div>
      <div className="video-mv-title">
        <span>MV排行榜<i className="iconfont icon-arrow home-icon-arrow"></i></span>
        <div className="commen-filter-item">
          <span>内地</span>
          <span>港台</span>
          <span>日本</span>
          <span>欧美</span>
          <span>韩国</span>
        </div>
      </div>
      <div className="video-mv-toplist">
        {
          toplist.map(mv => (
            <div className="video-mv-toplist-item ">
              <img className="video-mv-toplist-img" src={mv.cover + '?param=230y130'} alt=""/>
              <div className="video-mv-tiolist-info">
                <div className="video-mv-tiolist-name">{mv.name}</div>
                <div className="video-mv-tiolist-artist">{mv.artistName}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default MvRecomend