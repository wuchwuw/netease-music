import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic } from 'UTIL/activity'

const Friends: React.SFC = () => {
  const [act, setAct] = useState([])
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
    } catch (e) {}
  }

  async function getActivity () {
    try {
      const res = await api.getActivity({})
      console.log(res.data.event)
      res.data.event.forEach((item) => {
        console.log(JSON.parse(item.json))
      })
    } catch (e) {}
  }

  return (
    <div className="activity-container">
      <div className="activity-list"></div>
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