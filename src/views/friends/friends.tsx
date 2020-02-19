import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic, cretaeActicityList, ActivityClass } from 'UTIL/activity'

const Friends: React.SFC = () => {
  const [activity, setActivity] = useState<ActivityClass[]>([])
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

  const genActivityContent = (act: ActivityClass) => {

  }

  return (
    <div className="activity-container">
      <div className="activity-list">
        {
          activity.map(act => {
            if (act.type === 33) {
              return (
                <div className="activity-list-topic">
                  <div>
                    <img src={act.content.coverPCUrl} alt=""/>
                  </div>
                </div>
              )
            } else {
              return (
                <div className="activity-user">
                  <img className="activity-user-avatar" src={act.user.avatarUrl} alt=""/>
                  <div className="activity-user-info">
                    <div className="activity-use-info-name">
                      {act.user.nickname}
                      <span>{act.activityText}</span>
                    </div>
                    <div>{act.eventTime}</div>
                    <div>{act.message}</div>
                    <div>{genActivityContent(act)}</div>
                  </div>
                </div>
              )
            }
          })
        }
      </div>
      <div className="activity-topic">
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