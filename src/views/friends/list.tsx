import React, { useState } from 'react'
import { ActivityInfo, ActivityClassType, ActivityType } from 'UTIL/activity'
import api from 'API/index'
import Comment from 'COMPONENTS/comment/comment'
import { usePlayerController } from 'UTIL/player-controller'
import classnames from 'classnames'
import './list.less'
import Icon from 'COMPONENTS/icon/icon'
import { usePageForword } from 'ROUTER/hooks'

interface EventListProps {
  list: ActivityClassType[]
  updateList?: () => void
}

const EventList: React.SFC<EventListProps> = ({ list = [], updateList }) => {

  const [commentIndex, setCommentIndex] = useState(-1)
  const { start } = usePlayerController()
  const { goUserDetail, goPlaylistDetail, goMVDetail, goVideoDetail, goAlbumDetail, goArtistDetail } = usePageForword()

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
          <div key={act.id} styleName="activity-list-topic">
            <div styleName="activity-list-topic-info">
              <div>#{act.content.title}#</div>
              <div>{act.content.participateCount}人参与</div>
            </div>
            <img src={act.content.coverPCUrl} alt=""/>
          </div>
        )
      default:
        return (
          <div key={act.id} styleName="activity-item">
            <img styleName="activity-user-avatar" src={act.user.avatarUrl} alt=""/>
            <div styleName="activity-user-info">
              <div styleName="activity-use-info-name">
                <span onClick={() => { goUserDetail(act.user.userId) }}>{act.user.nickname}</span>
                {act.activityText}
              </div>
              <div styleName="activity-use-info-time">{act.showTimeFormat}</div>
              <div styleName="activity-use-info-message">{act.message}</div>
              <div styleName="activity-content">{genActivityContent(act)}</div>
              {genActivityImages(act)}
              {genActivityOption(act)}
              { commentIndex === act.id &&
                <div styleName="activity-comment-wrap">
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
      <div styleName="activity-image-content">
        {
          images.map((image, index) => (
            <div key={index} styleName="activity-image-item">
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
      <div styleName="activity-option">
        <span><Icon fontSize={15} name="icon-zan" onClick={() => { activityLike(info) }} className={`icon-color-${info.liked ? 'main' : '9'} hover`}></Icon>{!!info.likedCount ? info.likedCount : ''}</span>
        <span><Icon name="icon-share" className="icon-color-9 hover"></Icon>{!!info.shareCount ? info.shareCount : ''}</span>
        <span><Icon onClick={() => { showComment(act.id) }} name="icon-comment" className="icon-color-9 hover"></Icon>{!!info.commentCount ? info.commentCount : ''}</span>
      </div>
    )
  }

  const genActivityContent = (act: ActivityClassType) => {
    switch (act.type) {
      case ActivityType.Song:
        return (
          <div onDoubleClick={() => { start({ id: 'friends', name: '动态' }, act.content) }} styleName="activity-song">
            <div styleName="activity-song-wrap">
              <Icon
                onClick={() => { start({ id: 'friends', name: '动态' }, act.content) }}
                name="icon-triangle-full"
                styleName="activity-play-icon activity-song-play-icon"
                fontSize={12}
              >
              </Icon>
              <img src={act.content.album.picUrl + '?param=100y100'} alt=""/>
            </div>
            <div styleName="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.Video:
      case ActivityType.VideoShare:
        return (
          <div onClick={() => { goVideoDetail(act.content.vid) }} styleName="activity-video">
            <div styleName="activity-song-wrap">
              <Icon name="icon-triangle-full" styleName="activity-play-icon activity-video-play-icon"></Icon>
              <img src={act.content.coverUrl} alt=""/>
            </div>
            <div styleName="activity-video-info">
              <span><Icon name="icon-triangle"></Icon>{act.content.playTime_format}</span>
              <span>{act.content.duration_format}</span>
            </div>
          </div>
        )
      case ActivityType.MV:
        return (
          <div onClick={() => { goMVDetail(act.content.id) }} styleName="activity-video">
            <div styleName="activity-song-wrap">
              <Icon name="icon-triangle-full" styleName="activity-play-icon activity-video-play-icon"></Icon>
              <img src={act.content.cover} alt=""/>
            </div>
            <div styleName="activity-video-info">
              <span><Icon name="icon-triangle"></Icon>{act.content.playCount_format}</span>
              <span>{act.content.duration_format}</span>
            </div>
          </div>
        )
      case ActivityType.Forword:
        return (
          <div styleName="activity-forword">
            <div styleName="activity-forword-info"><span>{'@' + act.content.user.nickname}</span>{act.content.activityText + ': ' + act.content.message}</div>
            <div styleName="activity-forword-content">{genActivityContent(act.content)}</div>
            {genActivityImages(act.content)}
            {genActivityOption(act.content)}
            { commentIndex === act.content.id &&
              <div styleName="activity-comment-wrap">
                <Comment type="event" textareaType="deep" id={act.content.info.commentThread.id}></Comment>
              </div>
            }
          </div>
        )
      case ActivityType.Album:
        return (
          <div onClick={() => { goAlbumDetail(act.content.id) }} styleName="activity-song">
            <img src={act.content.picUrl} alt=""/>
            <div styleName="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.ARTIST:
        return (
          <div onClick={() => { goArtistDetail(act.content.id) }} styleName="activity-song">
            <img src={act.content.img1v1Url} alt=""/>
            <div styleName="activity-song-info">
              <div>{act.content.name}</div>
            </div>
          </div>
        )
      case ActivityType.PLAYLIST:
        return (
          <div onClick={() => { goPlaylistDetail(act.content.id) }} styleName="activity-song">
            <img src={act.content.coverImgUrl} alt=""/>
            <div styleName="activity-song-info">
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