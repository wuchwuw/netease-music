import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { Video, createVideo } from 'UTIL/video'
import Share from 'COMPONENTS/share/share'

const VideoDetail = () => {
  const { id: videoId = '' } = useParams()
  const [video, setVideo] = useState<Video>(createVideo({}))
  const [related, setRelated] = useState<Video[]>([])
  const [url, setURL] = useState('')

  useEffect(() => {
    if (videoId) {
      getVideoDetail()
      getRelatedDetail()
      getVideoURL()
    }
  }, [videoId])

  async function getVideoDetail () {
    try {
      const res = await api.getVideoDetail({ id: videoId })
      setVideo(createVideo(res.data.data))
    } catch (e) {}
  }

  async function getRelatedDetail () {
    try {
      const res = await api.getRelatedVideo({id: videoId})
      setRelated(res.data.data.map((item: any) => createVideo({
        ...item,
        creator: {
          nickname: item.creator[0].userName,
          userId: item.creator[0].userId
        }
      })))
    } catch (e) {}
  }

  async function getVideoURL () {
    try {
      const res = await api.getVideoURL({ id: videoId })
      res.data.urls && setURL(res.data.urls[0].url)
    } catch (e) {}
  }

  function onVideoCanPlay () {}

  return (
    <div className="video-detail">
      <div className="video-detail-container">
        <div className="video-detail-info">
          <div className="video-detail-title"><i className="iconfont icon-arrow-left"></i>视频详情</div>
          <div className="video-detail-player">
            <video onCanPlay={onVideoCanPlay} controls id="video" src={url}></video>
          </div>
          <div className="video-detail-user">
            <img src={video.creator.avatarUrl} alt=""/>
            <span>{video.creator.nickname}</span>
          </div>
          <div className="video-detail-info-title">{video.title}</div>
          <div className="video-detail-info-count">发布:&nbsp;{video.publishTime}&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;{video.playTime_format}次</div>
          <Share type="video" count={video.shareCount} shareContent={video}></Share>
          <div className="video-detail-info-option">
            <span className="artist-info-option-star"><i className="iconfont icon-zan"></i>赞({video.praisedCount})</span>
            <span className="artist-info-option-user"><i className="iconfont icon-zan"></i>收藏({video.subscribeCount})</span>
            <span className="artist-info-option-user"><i className="iconfont icon-share"></i>分享({video.shareCount})</span>
          </div>
          <Comment type="video" showTitle id={videoId}></Comment>
        </div>
        <div className="video-detail-related">
          <div className="video-detail-title">相关推荐</div>
          <ul className="video-related-list">
            {
              related.map(video => (
                <li key={video.vid} className="video-related-list-item">
                  <div className="video-related-list-item-img">
                    <img src={video.coverUrl} alt=""/>
                    <div className="video-related-list-item-duration">{video.duration_format}</div>
                    <div className="video-related-list-item-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
                  </div>
                  <div className="video-related-list-item-info">
                    <div>{video.title}</div>
                    <div>by {video.creator.nickname}</div>
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoDetail