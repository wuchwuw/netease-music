import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic, cretaeActicityList, ActivityClassType, ActivityType, ActivityInfo } from 'UTIL/activity'
import Spin from 'COMPONENTS/spin/spin'
import LoadMore from 'COMPONENTS/load-more/load-more'
import Comment from 'COMPONENTS/comment/comment'

let hasmore = true
let loading = true
let lasttime = -1

const Friends: React.SFC = () => {
  const [activity, setActivity] = useState<ActivityClassType[]>([])
  const [topic, setTopic] = useState<Topic[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const [commentIndex, setCommentIndex] = useState(-1)

  useEffect(() => {
    getActivity(false)
    getTopic()
  }, [])

  async function getTopic () {
    try {
      const res = await api.getHotTopic({ limit: 8 })
      setTopic(res.data.hot)
    } catch (e) {
      console.log(e)
    }
  }

  async function getActivity (loadmore: boolean) {
    try {
      loading = true
      !loadmore && setActivityLoading(true)
      const res = await api.getActivity({ lasttime, limit: 20 })
      loadmore ? setActivity(activity => activity.concat(cretaeActicityList(res.data.event))) : setActivity(cretaeActicityList(res.data.event))
      setActivityLoading(false)
      hasmore = res.data.more
      loading = false
      lasttime = res.data.lasttime
    } catch (e) { 
      console.log(e) 
    }
  }
  
  function showComment (index: number) {
    if (index === commentIndex) {
      setCommentIndex(-1)
      return
    }
    setCommentIndex(index)
  }

  function loadmore () {
    if (loading) return
    if (!hasmore) return
    getActivity(true)
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
              <div>{genActivityContent(act)}</div>
              <div>{genActivityOption(act, index)}</div>
              { commentIndex === index && 
                <div className="activity-comment-wrap">
                  <Comment type="event" id={act.info.commentThread.id}></Comment>
                </div>
              }
            </div>
          </div>
        )
    }
  }

  const genActivityOption = (act: ActivityClassType, index: number) => {
    const info: ActivityInfo = act.info
    return (
      <div className="activity-option">
        <span><i className="iconfont icon-zan"></i>{info.likedCount}</span>
        <span><i className="iconfont icon-share"></i>{info.shareCount}</span>
        <span><i onClick={() => { showComment(index) }} className="iconfont icon-comment"></i>{info.commentCount}</span>
      </div>
    )
  }

  const genActivityContent = (act: ActivityClassType) => {
    switch (act.type) {
      case ActivityType.Song:
        return (
          <div className="activity-song">
            <div className="activity-song-wrap">
              <i className="iconfont icon-triangle-full activity-play-icon activity-song-play-icon"></i>
              <img src={act.content.album.picUrl + '?param=100y100'} alt=""/>
            </div>  
            <div className="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.Video:
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
      case ActivityType.Forword:
        return (
          <div className="activity-forword">
            <div className="activity-forword-info"><span>{'@' + act.content.user.nickname}</span>{act.content.activityText + ':' + act.content.message}</div>
            <div className="activity-forword-content">{genActivityContent(act.content)}</div>
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
    }
  }

  return (
    <LoadMore load={loadmore}>
      <div className="activity-container">
        <div className="activity-list">
          <Spin loading={activityLoading} delay={300}>
            {
              activity.map((act, index) => (
                genActivityItem(act, index)
              ))
            }
          </Spin>
        </div>
        <div className="activity-topic">
        <div className="activity-topic-title">热门话题<i className="iconfont icon-arrow home-icon-arrow"></i></div>
          {
            topic.map(item => (
              <div key={item.actId} className="activity-topic-item">
                <img className="activity-topic-img" src={item.sharePicUrl + '?param=40y40'} alt=""/>
                <div className="activity-topic-info">
                  <div className="activity-topic-name">
                    #<span>{item.title}</span>#
                  </div>
                  <div className="activity-topic-count">{item.participateCount}人参与</div>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </LoadMore>
  )
}

export default Friends