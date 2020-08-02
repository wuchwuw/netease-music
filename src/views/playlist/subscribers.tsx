import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import User from 'UTIL/user'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import api from 'API/index'
import './subscribers.less'
import { useLoadMoreParams } from 'API/hooks'
import Icon from 'COMPONENTS/icon/icon'

interface SubscribersProps {
  playlistId: number
}
export interface SubscribersRef {
  loadmore: () => void
}

const SUBSCRIBERS_LIMIT = 30
const Subscribers = forwardRef(({ playlistId }: SubscribersProps, ref) => {
  const [ subscribers, setSubscribers ] = useState<User[]>([])
  const { goUserDetail } = usePageForword()
  const { limit, offset, setOffset, hasmore, moreloading, setHasMore, setMoreLoading } = useLoadMoreParams(SUBSCRIBERS_LIMIT)

  useEffect(() => {
    getSubscribers()
  }, [])

  async function getSubscribers () {
    try {
      setMoreLoading(true)
      const res = await api.getPlaylistSubscribers({ id: playlistId, limit: limit.current, offset: offset.current })
      setSubscribers(s => s.concat(res.data.subscribers))
      setHasMore(res.data.more)
      setMoreLoading(false)
    } catch (e) {}
  }

  function loadmore () {
    if (!hasmore.current) return
    if (moreloading.current) return
    setOffset(offset.current + limit.current)
    getSubscribers()
  }

  useImperativeHandle(ref, () => ({
    loadmore
  }), [])

  return (
    <div styleName="playlist-subscribers">
      {
        subscribers.map(user =>
          <div key={user.userId} styleName="playlist-subscribers-item">
            <img onClick={() => { goUserDetail(user.userId) }} src={user.avatarUrl + '?param=100y100'} alt=""/>
            <div styleName="playlist-subscribers-info-wrap">
              <span className="commen-link-333333 active" onClick={() => { goUserDetail(user.userId) }}>{user.nickname}</span>
              <Icon
                styleName={user.gender === 1 ? 'icon-boy' : 'icon-girl'}
                name={user.gender === 1 ? 'icon-boy' : 'icon-girl'}
                className="icon-color-333333 hover"
              ></Icon>
              { user.signature && <div styleName="playlist-subscribers-signature">{user.signature}</div> }
            </div>
          </div>
        )
      }
    </div>
  )
})

export default Subscribers