import React, { useEffect, useState } from 'react'
import UserList from '../list/list'
import api from 'API/index'
import { useParams } from 'react-router'
import User, { createUserList } from 'UTIL/user'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { getQueryStringValue } from 'ROUTER/hooks'
import './followeds.less'
import PageTitle from 'COMPONENTS/page-title/page-title'

let offset = 0
let limit = 30
let loading = false
let hasmore = true
let page = 1

const Follows = () => {
  const { userId } = useParams()
  const [followeds, setFolloweds] = useState<User[]>([])
  const query = getQueryStringValue()

  useEffect(() => {
    getUserFollows()
    return () => {
      offset = 0
      page = 1
      hasmore = true
      loading = false
    }
  }, [])

  async function getUserFollows () {
    try {
      loading = true
      const res = await api.getUserFolloweds({ offset, limit, uid: Number(userId) })
      setFolloweds(f => f.concat(createUserList(res.data.followeds)))
      hasmore = res.data.more
      loading = false
    } catch (e) {}
  }

  function loadmore () {
    if (!hasmore) return
    if (loading) return
    page++
    offset = (page - 1) * limit
    getUserFollows()
  }

  function updateList () {
    setFolloweds([...followeds])
  }

  return (
    <div style={{ height: '100%' }}>
      <PageTitle><span className="topbar-content-title">{ query.username && <span>{query.username}的粉丝</span>}</span></PageTitle>
      <LoadMore load={loadmore}>
        <UserList type="followeds" users={followeds} updateList={updateList}></UserList>
      </LoadMore>
    </div>
  )
}

export default Follows