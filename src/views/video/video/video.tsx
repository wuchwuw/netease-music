import React, { useEffect, useState } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import './video.less'
import { Video, createVideoList } from 'UTIL/video'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { usePageForword } from 'ROUTER/hooks'
import { useContainer } from 'COMPONENTS/container/container'
import Spin from 'COMPONENTS/spin/spin'

interface VideoCate {
  id: number
  name: string
}

const All_Cate = {
  id: 0,
  name: '全部视频'
}
let offset = 0
let loadmoreloading = false

const Viode: React.SFC = () => {
  const [ tags, setTags ] = useState<VideoCate[]>([])
  const [ videos, setVideos ] = useState<Video[]>([])
  const [ currentCate, setCurrentCate ] = useState(All_Cate.id)
  const [ currentCateName, setCurrentCateName ] = useState(All_Cate.name)
  const [ loading, setLoading ] = useState(false)
  const { goVideoDetail } = usePageForword()
  const { open, visiable } = useContainer(['.video-filter-btn'])

  useEffect(() => {
    getVideoTags()
  }, [])

  useEffect(() => {
    setLoading(true)
    getVideoList(false)
  }, [currentCate])

  async function getVideoTags () {
    try {
      const res = await api.getVideoTags()
      setTags(res.data.data)
    } catch (e) {}
  }

  async function getVideoList (loadmore: boolean) {
    try {
      function getParams () {
        if (currentCate === 0) {
          offset = offset + 8
          return {
            offset
          }
        } else {
          return {
            id: currentCate,
            timestamp: +new Date()
          }
        }
      }
      loadmoreloading = true
      const apiFn = currentCate === 0 ? api.getAllVideo : api.getViodeList
      const res = await apiFn(getParams())
      const res1 = await apiFn(getParams())
      const videos = res.data.datas.concat(res1.data.datas).filter((item: any) => item.type === 1).map((item: any) => item.data)
      loadmore ? setVideos(oldvideos => oldvideos.concat(createVideoList(videos))) : setVideos(createVideoList(videos))
      setLoading(false)
      loadmoreloading = false
    } catch (e) {}
  }

  function loadmore () {
    if (loadmoreloading) return
    getVideoList(true)
  }

  const setCate = (cate: VideoCate) => {
    setCurrentCate(cate.id)
    setCurrentCateName(cate.name)
  }

  return (
    <LoadMore load={loadmore}>
      <div className="video-container">
        <div className="video-filter">
          <div className="video-filter-btn-wrap">
            <div className="video-filter-btn" onClick={open}>{currentCateName}<i className="iconfont icon-arrow-right"></i></div>
            {
              visiable && (
                <div className="video-cate">
                  <div className="video-cate-all" onClick={() => { setCate(All_Cate) }}>全部视频</div>
                  <div className="video-cate-item">
                    {
                      tags.map(item => (
                        <span key={item.id} className={classnames({'active': currentCate === item.id})} onClick={() => { setCate(item) }}>{item.name}</span>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
          <div>
            {
              tags.slice(0, 8).map(cate => (
                <span
                  className={classnames('video-filter-item', {'active': currentCate === cate.id})}
                  key={cate.id}
                  onClick={() => { setCate(cate) }}
                >
                  {cate.name}
                </span>
              ))
            }
          </div>
        </div>
        <Spin loading={loading} delay={0}>
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
        </Spin>
      </div>
    </LoadMore>
  )
}

export default Viode