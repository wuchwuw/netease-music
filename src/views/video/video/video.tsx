import React, { useEffect, useState } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import './video.less'
import { Video, createVideoList } from 'UTIL/video'

interface VideoCate {
  id: number
  name: string
}

const Viode: React.SFC = () => {
  const [ tags, setTags ] = useState<VideoCate[]>([])
  const [ videos, setVideos ] = useState<Video[]>([])
  const [ currentTags, setCurrentTags ] = useState(58100)
  useEffect(() => {
    getVideoTags()
  }, [])

  useEffect(() => {
    getVideoList()
  }, [currentTags])

  async function getVideoTags () {
    try {
      const res = await api.getVideoTags()
      setTags(res.data.data.slice(0, 9))
    } catch (e) { console.log(e) }
  }

  async function getVideoList () {
    try {
      const params = {
        id: currentTags,
        limit: 30
      }
      const res = await api.getViodeList(params)
      setVideos(createVideoList(res.data.datas.filter((item: any) => item.type !== 4).map((item: any) => item.data)))
    } catch (e) { console.log(e) }
  }
  return (
    <div className="video-container">
      <div className="home-album-filter"> 
        <div className="home-album-filter-btn">全部视频<i className="iconfont icon-arrow"></i></div>
        <div className="home-album-filter">
          {
            tags.map(cate => (
              <span
               className={classnames('home-album-filter-item', {'active': currentTags === cate.id})} 
               key={cate.id}
               onClick={() => { setCurrentTags(cate.id) }}
              >
                {cate.name}
              </span>
            ))
          }
        </div>
      </div>
      <div className="commen-area-content">
        {
          videos.map((video) => (
            <div className="commen-area-item commen-area-item-large">
              <div className="commen-area-img-wrap">
                <img src={video.coverUrl+'?param=230y130'} alt=""/>
                <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
                <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <div className="commen-area-duration">{video.duration_format}</div>
              </div>         
              <div className="commen-area-text">{video.title}</div>
              <div className="commen-area-artist">by {video.creator.nickname}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Viode