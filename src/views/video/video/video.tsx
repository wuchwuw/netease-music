import React, { useEffect, useState } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import './video.less'
import { Video, createVideoList } from 'UTIL/video'

const Viode: React.SFC = () => {
  const [ tags, setTags ] = useState([])
  const [ videos, setVideos ] = useState<Video[]>([])
  const [ currentTags, setCurrentTags ] = useState({
    name: '',
    id: -1
  })
  useEffect(() => {
    getVideoTags()
  }, [])

  useEffect(() => {
    getVideoList()
  }, [])

  async function getVideoTags () {
    try {
      const res = await api.getVideoTags()
      setTags(res.data.data.slice(0, 9))
    } catch (e) { console.log(e) }
  }
  async function getVideoList () {
    try {
      const params = {
        id: 58100,
        limit: 30
      }
      const res = await api.getViodeList(params)
      setVideos(createVideoList(res.data.datas.map((item: any) => item.data)))
    } catch (e) {}
  }
  return (
    <div className="video-container">
      <div className="home-album-filter">
        <div className="home-album-filter-btn">全部视频<i className="iconfont icon-arrow"></i></div>
        <div className="home-album-filter">
          {
            tags.map(cate => (
              <span className={classnames('home-album-filter-item', {'active': currentTags.name === cate.name})} key={cate.id}>{cate.name}</span>
            ))
          }
        </div>
      </div>
      <div className="commen-area-content">
        {
          videos.map((video) => (
            <div className="commen-area-item commen-area-item-large">
              <img src={video.coverUrl+'?param=230y130'} alt=""/>
              <div className="commen-area-text">{video.title}</div>
              <div className="commen-area-artist">{video.creator.nickname}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Viode