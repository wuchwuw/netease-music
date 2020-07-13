import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { Video, createVideo } from 'UTIL/video'
import Icon from 'COMPONENTS/icon/icon'
import Button from 'COMPONENTS/button/button'
import classnames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
// import { createShareDialog, ShareType } from 'COMPONENTS/dialog/create'

let videoCache = {}

const VideoDetail = () => {
  const { id: videoId = '' } = useParams()
  const [video, setVideo] = useState<Video>(createVideo({}))
  const [related, setRelated] = useState<Video[]>([])
  const [url, setURL] = useState('')
  const { back } = usePageForword()
  // const openShareDialog = createShareDialog()

  useEffect(() => {
    if (videoId) {
      getVideoDetail()
      getRelatedDetail()
      getVideoURL()
    }
  }, [videoId])

  async function getVideoDetail () {
    try {
      const res = await Promise.all([api.getVideoDetail({ id: videoId }), api.getVideoInfo({ vid: videoId })])
      setVideo(createVideo(videoCache = {
        ...res[0].data.data,
        ...res[1].data
      }))
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

  async function like () {
    try {
      const params = {
        t: video.liked ? 2 : 1,
        type: 5,
        id: video.vid
      }
      await api.likeResource(params)
      setVideo(createVideo(videoCache = {
        ...videoCache,
        likedCount: video.liked ? -- video.likedCount : ++ video.likedCount,
        liked: !video.liked
      }))
    } catch (e) { console.log(e) }
  }

  return (
    <div styleName="video-detail">
      <div styleName="video-detail-container">
        <div styleName="video-detail-info">
          <span onClick={() => { back() }} styleName="video-detail-title" className="commen-link-333333 active"><Icon fontSize={18} name="icon-arrow-left"></Icon>视频详情</span>
          <div styleName="video-detail-player">
            <video onCanPlay={onVideoCanPlay} controls id="video" src={url}></video>
          </div>
          <div styleName="video-detail-user">
            <img src={video.creator.avatarUrl + '?param=100y100'} alt=""/>
            <span className="commen-link-333333 active">{video.creator.nickname}</span>
          </div>
          <div styleName="video-detail-info-title">{video.title}</div>
          <div styleName="video-detail-info-count">发布:&nbsp;{video.publishTimeFormat}&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;{video.playTime_format}次</div>
          <div styleName="video-detail-info-option">
            <Button onClick={like} icon={<Icon className={classnames({ 'icon-color-main': video.liked})} name="icon-zan"></Icon>}>赞({video.likedCount})</Button>
            {/* <Button onClick={sub} icon={<Icon name="icon-star"></Icon>}>{video.subed ? '已收藏' : '收藏'}({mv.subCount})</Button> */}
            {/* <Button onClick={() => { openShareDialog({ type: ShareType.VIDEO, shareContent: video }) }} icon={<Icon name="icon-share"></Icon>}>分享({video.shareCount})</Button> */}
          </div>
          <Comment type="video" showTitle id={videoId}></Comment>
        </div>
        <div styleName="video-detail-related">
          <div styleName="video-detail-title">相关推荐</div>
          <ul>
            {
              related.map(video => (
                <li key={video.vid} styleName="video-related-list-item">
                  <div styleName="video-related-list-item-img">
                    <img src={video.coverUrl} alt=""/>
                    <div styleName="video-related-list-item-duration">{video.duration_format}</div>
                    <div styleName="video-related-list-item-playcount"><i className="iconfont icon-triangle"></i>{video.playTime_format}</div>
                  </div>
                  <div styleName="video-related-list-item-info">
                    <div styleName="video-related-list-item-info-title" className="commen-link-333333 active">{video.title}</div>
                    <div className="text-overflow">by <span className="commen-link-666666 active">{video.creator.nickname}</span></div>
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