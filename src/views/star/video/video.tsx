import React, { useEffect, useState } from 'react'
import api from 'API/index'
import { createVideoListWidthType, VideoWidthType } from 'UTIL/video'
import { usePageForword } from 'ROUTER/hooks'
import './video.less'

const StarVideo = () => {
  const [videos, setVideos] = useState<VideoWidthType[]>([])
  const [count, setCount] = useState(0)
  const { goVideoDetail, goMVDetail, goUserDetail, goArtistDetail } = usePageForword()

  useEffect(() => {
    getMVSubList()
  }, [])

  async function getMVSubList () {
    try {
      const res = await api.getMVSubList()
      setVideos(createVideoListWidthType(res.data.data))
      setCount(res.data.count)
    } catch (e) {}
  }

  function onVideoItemClick (video: VideoWidthType) {
    if (video.type === 'video') {
      goVideoDetail(video.vid)
    } else {
      goMVDetail(video.vid)
    }
  }

  function onVideoUserClick (video: VideoWidthType) {
    const { userId } = video.createBy[0]
    if (video.type === 'video') {
      goUserDetail(Number(userId))
    } else {
      goArtistDetail(Number(userId))
    }
  }

  return (
    <div className="star-video-container">
      <div className="star-video-title">收藏的视频({count})</div>
      <div className="commen-area-content">
        {
          videos.map((video) => (
            <div key={video.vid} className="commen-area-item commen-area-item-large">
              <div onClick={() => { onVideoItemClick(video) }} className="commen-area-img-wrap">
                <img src={video.coverUrl+'?param=500y282'} alt=""/>
                <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
                <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <div className="commen-area-duration">{video.duration_format}</div>
              </div>
              <div className="commen-area-text" onClick={() => { onVideoItemClick(video) }}>{video.title}</div>
              <div className="commen-area-artist">by <span onClick={() => { onVideoUserClick(video) }} className="commen-link-999999 active">{video.createBy[0].userName}</span></div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default StarVideo