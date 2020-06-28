import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic, cretaeActicityList, ActivityClassType } from 'UTIL/activity'
import Spin from 'COMPONENTS/spin/spin'
import LoadMore from 'COMPONENTS/load-more/load-more'
import EventList from './list'
import PageTitle from 'COMPONENTS/page-title/page-title'
import Button from 'COMPONENTS/button/button'
import { createActivityPublishDialog } from 'COMPONENTS/dialog/create'
import Icon from 'COMPONENTS/icon/icon'

let hasmore = true
let loading = true
let lasttime = -1

const Friends: React.SFC = () => {
  const [activity, setActivity] = useState<ActivityClassType[]>([])
  const [topic, setTopic] = useState<Topic[]>([])
  const [activityLoading, setActivityLoading] = useState(false)
  const openActivityDialog = createActivityPublishDialog()

  useEffect(() => {
    getActivity(false)
    getTopic()
    return () => {
      hasmore = true
      loading = false
      lasttime = -1
    }
  }, [])

  async function getTopic () {
    try {
      const res = await api.getHotTopic({ limit: 8 })
      setTopic(res.data.hot)
    } catch (e) {}
  }

  async function getActivity (loadmore: boolean) {
    try {
      loading = true
      !loadmore && setActivityLoading(true)
      const res = await api.getActivity({ lasttime, limit: 20 })
      res.data && setActivity(activity => activity.concat(cretaeActicityList(res.data.event)))
      setActivityLoading(false)
      hasmore = res.data.more
      loading = false
      lasttime = res.data.lasttime
    } catch (e) {}
  }

  function loadmore () {
    if (loading) return
    if (!hasmore) return
    getActivity(true)
  }

  function shareSuccess (a: ActivityClassType) {
    setActivity([a, ...activity])
  }

  return (
    <LoadMore load={loadmore}>
      <PageTitle>
        <div>
          <span className="topbar-content-item active">动态</span>
          <Button
            icon={<Icon name="icon-share"></Icon>}
            type="primary"
            onClick={() => { openActivityDialog({ shareSuccess }) }}
          >
            发动态
          </Button>
        </div>
      </PageTitle>
      <div className="activity-container">
        <div className="activity-list">
          <Spin loading={activityLoading} delay={300}>
            <EventList list={activity} updateList={() => { setActivity([...activity]) }}></EventList>
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