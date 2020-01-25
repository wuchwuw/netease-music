import React, { useState, useEffect } from 'react'
import api from 'API/index'
import './mv.less'

const MvRecomend: React.SFC = () => {
  const [newMv, setNewMv] = useState([])

  useEffect(() => {
    getMv()
  }, [])

  async function getMv () {
    try {
      const res = await Promise.all([
        api.getNewMv({ limit: 6 }),
        api.getExclusiveMv({ limit: 6 }),
        api.getMvToplist({ limit: 10 })
      ])
      setNewMv(res[0].data.data)
    } catch (e) {}
  }

  return (
    <div>
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
      <div className="commen-viode-content">
        {
          newMv.map(mv => {

          })
        }
      </div>
      <div className="video-mv-title">
        <span>热播MV<i className="iconfont icon-arrow home-icon-arrow"></i></span>
      </div>
      <div className="video-mv-title">
        <span>网易出品<i className="iconfont icon-arrow home-icon-arrow"></i></span>
      </div>
      <div className="video-mv-title">
        <span>MV排行榜<i className="iconfont icon-arrow home-icon-arrow"></i></span>
      </div>
    </div>
  )
}

export default MvRecomend