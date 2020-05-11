import React, { useState, useEffect } from 'react'
import User from 'UTIL/user'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import api from 'API/index'

const SUBSCRIBERS_LIMIT = 30

const Subscribers = ({ playlistId }) => {
  const [ subscribers, setSubscribers ] = useState<User[]>([])
  const { goUserDetail } = usePageForword()

  useEffect(() => {
    getSubscribers(1)
  }, [])

  async function getSubscribers (page: number) {
    try {
      const offset = (page - 1) * SUBSCRIBERS_LIMIT
      const res = await api.getPlaylistSubscribers({ id: playlistId, limit: SUBSCRIBERS_LIMIT, offset })
      setSubscribers(res.data.subscribers)
    } catch (e) {}
  }

  return (
    <div className="playlist-subscribers">
      {
        subscribers.map(user =>
          <div key={user.userId} className="playlist-subscribers-item">
            <img onClick={() => { goUserDetail(user.userId) }} src={user.avatarUrl + '?params=100y100'} alt=""/>
            <div className="playlist-subscribers-info-wrap">
              <span onClick={() => { goUserDetail(user.userId) }}>{user.nickname}</span>
              <i className={classNames('iconfont', user.gender === 1 ? 'icon-boy' : 'icon-girl')}></i>
              { user.signature && <div className="playlist-subscribers-signature">{user.signature}</div> }
            </div>
          </div>
        )
      }
    </div>
  )
}

export default Subscribers