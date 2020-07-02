import React, { useEffect, useState } from 'react'
import './friends.less'
import api from 'API/index'
import { Topic, cretaeActicityList, ActivityClassType } from 'UTIL/activity'
import Spin from 'COMPONENTS/spin/spin'
import LoadMore from 'COMPONENTS/load-more/load-more'
import EventList from './list'
import PageTitle from 'COMPONENTS/page-title/page-title'
import Button from 'COMPONENTS/button/button'
import { createActivityPublishDialog, ShareType } from 'COMPONENTS/dialog/create'
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
            onClick={() => { openActivityDialog({ type: ShareType.DETAULT ,shareSuccess }) }}
          >
            发动态
          </Button>
        </div>
      </PageTitle>
      <div styleName="activity-container">
        <div styleName="activity-list">
          <Spin loading={activityLoading} delay={300}>
            <EventList list={activity} updateList={() => { setActivity([...activity]) }}></EventList>
          </Spin>
        </div>
        <div styleName="activity-topic">
        <div styleName="activity-topic-title">热门话题<Icon name="iconfont icon-arrow-right"></Icon></div>
          {
            topic.map(item => (
              <div key={item.actId} styleName="activity-topic-item">
                <img styleName="activity-topic-img" src={item.sharePicUrl + '?param=100y100'} alt=""/>
                <div styleName="activity-topic-info">
                  <div styleName="activity-topic-name">
                    #<span>{item.title}</span>#
                  </div>
                  <div styleName="activity-topic-count">{item.participateCount}人参与</div>
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