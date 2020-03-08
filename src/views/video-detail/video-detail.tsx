import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'

const VideoDetail = () => {
  const { id } = useParams()
  const videoId = Number(id)
  const [type, setType] = useState('mv')

  useEffect(() => {
    getVideoDetail()
  }, [])

  async function getVideoDetail () {
    try {
      const res = type === 'mv' ? await api.getMVDetail({mvid: videoId}) : api.getVideoDetail({id: videoId})
      console.log(res)
    } catch (e) {}
  }

  return (
    <div className="video-detail">
      <div className="video-detail-container">
        <div className="video-detail-info">
          <div className="video-detail-title"><i className="iconfont icon-arrow"></i>视频详情</div>
          <div className="video-detail-player"></div>
          <div className="video-detail-user">
            <img src="http://p1.music.126.net/RTUwmcth8YSOzoFRq5T2pQ==/6036318836818799.jpg?param=180y180" alt=""/>
            <span>阿斯达啊</span>
          </div>
          <div className="video-detail-info-title">阿斯达阿斯达暗示暗示</div>
          <div className="video-detail-info-count">发布:&nbsp;2022-20-20&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;3333次</div>
          <div className="video-detail-info-option">
            <span className="artist-info-option-star"><i className="iconfont icon-zan"></i>点赞</span>
            <span className="artist-info-option-user"><i className="iconfont icon-zan"></i>收藏(0)</span>
            <span className="artist-info-option-user"><i className="iconfont icon-share"></i>分享(0)</span>
          </div>
          <Comment type="mv" id={videoId}></Comment>
        </div>
        <div className="video-detail-recomend">
          <div className="video-detail-title">相关推荐</div>
        </div>
      </div>
    </div>
  )
}

export default VideoDetail