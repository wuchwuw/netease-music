import React, { useEffect, useState } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import './video.less'
import { Video, createVideoList } from 'UTIL/video'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { usePageForword } from 'ROUTER/hooks'

interface VideoCate {
  id: number
  name: string
}

const Viode: React.SFC = () => {
  const [ tags, setTags ] = useState<VideoCate[]>([])
  const [ videos, setVideos ] = useState<Video[]>([])
  const [ currentTags, setCurrentTags ] = useState(58100)
  const [ loading, setLoading ] = useState(false)
  const { goVideoDetail } = usePageForword()

  useEffect(() => {
    getVideoTags()
  }, [])

  useEffect(() => {
    getVideoList(false)
  }, [currentTags])

  async function getVideoTags () {
    try {
      const res = await api.getVideoTags()
      setTags(res.data.data.slice(0, 8))
    } catch (e) {}
  }

  async function getVideoList (loadmore: boolean) {
    try {
      setLoading(true)
      function getParams () {
        return {
          id: currentTags,
          timestamp: +new Date()
        }
      }
      const res = await api.getViodeList(getParams())
      const res1 = await api.getViodeList(getParams())
      const videos = res.data.datas.concat(res1.data.datas).filter((item: any) => item.type !== 4).map((item: any) => item.data)
      loadmore ? setVideos(oldvideos => oldvideos.concat(createVideoList(videos))) : setVideos(createVideoList(videos))
      setLoading(false)
    } catch (e) { console.log(e) }
  }

  function loadmore () {
    if (loading) return
    getVideoList(true)
  }

  return (
    <LoadMore load={loadmore}>
      <div className="video-container">
        <div className="video-filter">
          <div className="video-filter-btn">全部视频<i className="iconfont icon-arrow-right"></i></div>
          <div className="video-filter">
            {
              tags.map(cate => (
                <span
                  className={classnames('video-filter-item', {'active': currentTags === cate.id})}
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
              <div key={video.vid} className="commen-area-item commen-area-item-large">
                <div onClick={() => { goVideoDetail(video.vid) }} className="commen-area-img-wrap">
                  <img src={video.coverUrl+'?param=500y282'} alt=""/>
                  <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
                  <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <div className="commen-area-duration">{video.duration_format}</div>
                </div>
                <div className="commen-area-text">{video.title}</div>
                <div className="commen-area-artist">by <span className="commen-link-999999 active">{video.creator.nickname}</span></div>
              </div>
            ))
          }
        </div>
      </div>
    </LoadMore>
  )
}

export default Viode