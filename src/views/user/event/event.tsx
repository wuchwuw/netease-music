import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { getQueryStringValue } from 'ROUTER/hooks'
import api from 'API/index'
import { cretaeActicityList, ActivityClassType } from 'UTIL/activity'
import Spin from 'COMPONENTS/spin/spin'
import LoadMore from 'COMPONENTS/load-more/load-more'
import EventList from 'VIEWS/friends/list'
import './event.less'
import PageTitle from 'COMPONENTS/page-title/page-title'

let hasmore = true
let loading = true
let lasttime = -1

const Event = () => {
  const { userId } = useParams()
  const query = getQueryStringValue()
  const [activity, setActivity] = useState<ActivityClassType[]>([])
  const [activityLoading, setActivityLoading] = useState(false)

  useEffect(() => {
    getActivity(false)
    return () => {
      hasmore = true
      loading = false
      lasttime = -1
    }
  }, [])

  async function getActivity (loadmore: boolean) {
    try {
      loading = true
      !loadmore && setActivityLoading(true)
      const res = await api.getUserEvent({ uid: Number(userId), lasttime, limit: 20 })
      setActivity(activity => activity.concat(cretaeActicityList(res.data.events)))
      setActivityLoading(false)
      hasmore = res.data.more
      loading = false
      lasttime = res.data.lasttime
    } catch (e) {
      console.log(e)
    }
  }

  function loadmore () {
    if (loading) return
    if (!hasmore) return
    getActivity(true)
  }

  return (
    <LoadMore load={loadmore}>
      <PageTitle>{ query.username && <span>{query.username}的动态</span>}</PageTitle>
      <div className="user-event-container">
      <Spin loading={activityLoading} delay={0}>
        <EventList list={activity} updateList={() => { setActivity([...activity]) }}></EventList>
      </Spin>
      </div>
    </LoadMore>
  )
}

export default Event