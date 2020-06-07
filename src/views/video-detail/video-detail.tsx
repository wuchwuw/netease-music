import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { Video, createVideo } from 'UTIL/video'

const VideoDetail = () => {
  const { id } = useParams()
  const videoId = String(id)
  const [ video, setVideo ] = useState<Video>(createVideo({}))
  const [ related, setRelated ] = useState<Video[]>([])

  useEffect(() => {
    getVideoDetail()
    getRelatedDetail()
    const video: HTMLVideoElement = document.querySelector('#video')
    video && video.play()
  }, [])

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

  return (
    <div className="video-detail">
      <div className="video-detail-container">
        <div className="video-detail-info">
          <div className="video-detail-title"><i className="iconfont icon-arrow"></i>视频详情</div>
          <div className="video-detail-player">
            <video controls id="video" src="http://vodkgeyttp9.vod.126.net/vodkgeyttp8/68sKFbGS_1328070069_hd.mp4?ts=1591542084&rid=A26FD9291531EB26E1FF4A609E255D9F&rl=3&rs=rvVNfefSbCPDnVVVuMyUuAjAbCsLKjOT&sign=12e51af213db362e368b6370eb4dc59b&ext=PNYT%2BbRvGBI%2F%2BFlVT8MxfYfgHtgUh0en8jf00UE7%2B5uQCbPboo%2BHMlpMB09NfUGUTTQkc%2BMmPNaVwHMOQD%2Fx6U901qUSfKqrZTbhEY2NPL1VJtey1n9uDlD3j%2BAbgdCTcwyR6agG9fisI4%2Bcn7C3tjfElXLGx7DOxDlQ6yzbtKnWegLhL1dpC4N%2F9kECH3rykRVTYTJEKg1rC6%2FP3SGkLtHSO2%2FAf%2Bx5llJXXEg%2FJo2ePgV4R4ncBKGVzGPMd0fz"></video>
          </div>
          <div className="video-detail-user">
            <img src={video.creator.avatarUrl} alt=""/>
            <span>{video.creator.nickname}</span>
          </div>
          <div className="video-detail-info-title">{video.title}</div>
          <div className="video-detail-info-count">发布:&nbsp;{video.publishTime}&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;{video.playTime_format}次</div>
          <div className="video-detail-info-option">
            <span className="artist-info-option-star"><i className="iconfont icon-zan"></i>点赞</span>
            <span className="artist-info-option-user"><i className="iconfont icon-zan"></i>收藏({video.subscribeCount})</span>
            <span className="artist-info-option-user"><i className="iconfont icon-share"></i>分享({video.shareCount})</span>
          </div>
          <Comment type="video" id={videoId}></Comment>
        </div>
        <div className="video-detail-related">
          <div className="video-detail-title">相关推荐</div>
          <ul className="video-related-list">
            {
              related.map(video => (
                <li className="video-related-list-item">
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