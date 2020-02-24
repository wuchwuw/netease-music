import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic, cretaeActicityList, ActivityClassType, ActivityType } from 'UTIL/activity'

const Friends: React.SFC = () => {
  const [activity, setActivity] = useState<ActivityClassType[]>([])
  const [topic, setTopic] = useState<Topic[]>([])
  useEffect(() => {
    getActivity()
  }, [])

  useEffect(() => {
    getTopic()
  }, [])

  async function getTopic () {
    try {
      const res = await api.getHotTopic({ limit: 8 })
      setTopic(res.data.hot)
      console.log(res)
    } catch (e) {
      console.log(e)
    }
  }

  async function getActivity () {
    try {
      const res = await api.getActivity({})
      setActivity(cretaeActicityList(res.data.event))
    } catch (e) {
      console.log(e)
    }
  }

  const genActivityItem = (act: ActivityClassType) => {
    if (!act.type) return
    switch (act.type) {
      case ActivityType.Topic:
        return (
          <div className="activity-list-topic">
            <img src={act.content.coverPCUrl} alt=""/>
          </div>
        )
      default:
        return (
          <div className="activity-item">
            <img className="activity-user-avatar" src={act.user.avatarUrl} alt=""/>
            <div className="activity-user-info">
              <div className="activity-use-info-name">
                <span>{act.user.nickname}</span>
                {act.activityText}
              </div>
              <div className="activity-use-info-time">{act.eventTimeFormat}</div>
              <div className="activity-use-info-message">{act.message}</div>
              <div>{genActivityContent(act)}</div>
            </div>
          </div>
        )
    }
  }

  const genActivityContent = (act: ActivityClassType) => {
    switch (act.type) {
      case ActivityType.Song:
        return (
          <div className="activity-song">
            <img src={act.content.picUrl} alt=""/>
            <div className="activity-song-info">
              <div>{act.content.name}</div>
              <div>{act.content.artistName}</div>
            </div>
          </div>
        )
      case ActivityType.Video:
        return (
          <div className="activity-video">
            <img src={act.content.coverUrl} alt=""/>
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
    }
  }

  return (
    <div className="activity-container">
      <div className="activity-list">
        {
          activity.map(act => (
            genActivityItem(act)
          ))
        }
      </div>
      <div className="activity-topic">
      <div className="activity-topic-title">热门话题<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        {
          topic.map(item => (
            <div className="activity-topic-item">
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
  )
}

export default Friends