import React from 'react'
import User from 'UTIL/user'
import './list.less'
import { useChat } from 'UTIL/chat-controller'
import { usePageForword } from 'ROUTER/hooks'
import api from 'API/index'
import notificationApi from 'COMPONENTS/notification'

interface UserListProps {
  users: User[],
  type: 'follows' | 'followeds',
  updateList?: () => void
}

const UserList: React.SFC<UserListProps> = ({ users = [], type = 'follows', updateList }) => {
  const { setCurrentChat } = useChat()
  const { goUserDetail } = usePageForword()

  async function follow (user: User) {
    try {
      const t = user.followed ? 2 : 1
      await api.userFollow({ t, id: user.userId })
      notificationApi.success({ content: user.followed ? '已取消关注' : '关注成功' })
      user.followed = !user.followed
      updateList && updateList()
    } catch (e) {}
  }

  return (
    <div className="userlist-container">
      {
        users.map(user => (
          <div onClick={() => { goUserDetail(user.userId) }} key={user.userId} className="userlist-item">
            <img src={user.avatarUrl + '?param=100y100'} alt=""/>
            <div className="userlist-item-info">
              <div className="userlist-item-name">{user.nickname}</div>
              <div className="userlist-item-signature">{user.signature}</div>
              <div className="userlist-item-count">
                <span>歌单：{user.playlistCount}</span>
                <span>粉丝：{user.followeds}</span>
              </div>
            </div>
            <div className="userlist-option">
              {
                type === 'follows' ?
                <span onClick={(e) => { e.stopPropagation(); setCurrentChat(user) }}><i className="iconfont icon-email"></i>私信</span>
                :
                <span onClick={(e) => { e.stopPropagation(); follow(user) }}>{user.followed ? <><i className="iconfont icon-gou"></i>已关注</> : <><i className="iconfont icon-add"></i>关注</>}</span>
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default UserList