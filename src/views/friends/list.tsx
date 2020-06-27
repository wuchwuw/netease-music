import React, { useState } from 'react'
import { ActivityInfo, ActivityClassType, ActivityType } from 'UTIL/activity'
import api from 'API/index'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import classnames from 'classnames'
import './list.less'

interface EventListProps {
  list: ActivityClassType[]
  updateList?: () => void
}

const EventList: React.SFC<EventListProps> = ({ list = [], updateList }) => {

  const [commentIndex, setCommentIndex] = useState(-1)
  const { start } = usePlayerController()

  async function activityLike (info: ActivityInfo) {
    try {
      const t = info.liked ? 2 : 1
      await api.likeResource({ t, type: 6, threadId: info.commentThread.id })
      info.liked = !info.liked
      info.likedCount = info.liked ? ++info.likedCount : --info.likedCount
      updateList && updateList()
    } catch (e) {}
  }

  function showComment (actId: number) {
    if (actId === commentIndex) {
      setCommentIndex(-1)
      return
    }
    setCommentIndex(actId)
  }

  const genActivityItem = (act: ActivityClassType, index: number) => {
    if (!act.type) return
    switch (act.type) {
      case ActivityType.Topic:
        return (
          <div key={act.id} className="activity-list-topic">
            <div className="activity-list-topic-info">
              <div>#{act.content.title}#</div>
              <div>{act.content.participateCount}人参与</div>
            </div>
            <img src={act.content.coverPCUrl} alt=""/>
          </div>
        )
      default:
        return (
          <div key={act.id} className="activity-item">
            <img className="activity-user-avatar" src={act.user.avatarUrl} alt=""/>
            <div className="activity-user-info">
              <div className="activity-use-info-name">
                <span>{act.user.nickname}</span>
                {act.activityText}
              </div>
              <div className="activity-use-info-time">{act.showTimeFormat}</div>
              <div className="activity-use-info-message">{act.message}</div>
              <div className="activity-content">{genActivityContent(act)}</div>
              {genActivityImages(act)}
              {genActivityOption(act)}
              { commentIndex === act.id &&
                <div className="activity-comment-wrap">
                  <Comment type="event" textareaType="deep" id={act.info.commentThread.id}></Comment>
                </div>
              }
            </div>
          </div>
        )
    }
  }

  const genActivityImages = (act: ActivityClassType) => {
    const images = act.pics
    return (
      <div className="activity-image-content">
        {
          images.map((image) => (
            <div className="activity-image-item">
              <img src={image.pcSquareUrl} alt=""/>
            </div>
          ))
        }
      </div>
    )
  }

  const genActivityOption = (act: ActivityClassType) => {
    const info: ActivityInfo = act.info
    return (
      <div className="activity-option">
        <span><i onClick={() => { activityLike(info) }} className={classnames('iconfont icon-zan', { 'active': info.liked })}></i>{!!info.likedCount ? info.likedCount : ''}</span>
        <span><i className="iconfont icon-share"></i>{!!info.shareCount ? info.shareCount : ''}</span>
        <span><i onClick={() => { showComment(act.id) }} className="iconfont icon-comment"></i>{!!info.commentCount ? info.commentCount : ''}</span>
      </div>
    )
  }

  const genActivityContent = (act: ActivityClassType) => {
    switch (act.type) {
      case ActivityType.Song:
        return (
          <div onDoubleClick={() => { start({ id: 'friends', name: '动态' }, act.content) }} className="activity-song">
            <div className="activity-song-wrap">
              <i onClick={() => { start({ id: 'friends', name: '动态' }, act.content) }} className="iconfont icon-triangle-full activity-play-icon activity-song-play-icon"></i>
              <img src={act.content.album.picUrl + '?param=100y100'} alt=""/>
            </div>
            <div className="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.Video:
      case ActivityType.VideoShare:
        return (
          <div className="activity-video">
            <div className="activity-song-wrap">
              <i className="iconfont icon-triangle-full activity-play-icon activity-video-play-icon"></i>
              <img src={act.content.coverUrl} alt=""/>
            </div>
            <div className="activity-video-info">
              <span><i className="iconfont icon-triangle"></i>{act.content.playTime_format}</span>
              <span>{act.content.duration_format}</span>
            </div>
          </div>
        )
      case ActivityType.MV:
        return (
          <div className="activity-video">
            <div className="activity-song-wrap">
              <i className="iconfont icon-triangle-full activity-play-icon activity-video-play-icon"></i>
              <img src={act.content.cover} alt=""/>
            </div>
            <div className="activity-video-info">
              <span><i className="iconfont icon-triangle"></i>{act.content.playCount_format}</span>
              <span>{act.content.duration_format}</span>
            </div>
          </div>
        )
      case ActivityType.Forword:
        return (
          <div className="activity-forword">
            <div className="activity-forword-info"><span>{'@' + act.content.user.nickname}</span>{act.content.activityText + ': ' + act.content.message}</div>
            <div className="activity-forword-content">{genActivityContent(act.content)}</div>
            {genActivityImages(act.content)}
            {genActivityOption(act.content)}
            { commentIndex === act.content.id &&
              <div className="activity-comment-wrap">
                <Comment type="event" textareaType="deep" id={act.content.info.commentThread.id}></Comment>
              </div>
            }
          </div>
        )
      case ActivityType.Album:
        return (
          <div className="activity-song">
            <img src={act.content.picUrl} alt=""/>
            <div className="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.ARTIST:
        return (
          <div className="activity-song">
            <img src={act.content.img1v1Url} alt=""/>
            <div className="activity-song-info">
              <div>{act.content.name}</div>
            </div>
          </div>
        )
      case ActivityType.PLAYLIST:
        return (
          <div className="activity-song">
            <img src={act.content.coverImgUrl} alt=""/>
            <div className="activity-song-info">
              <div>{act.content.name}</div>
            </div>
          </div>
        )
    }
  }
  return (
    <div>
      {
        list.map((act, index) => (
          genActivityItem(act, index)
        ))
      }
    </div>
  )
}

export default EventList