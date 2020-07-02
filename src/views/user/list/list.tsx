import React from 'react'
import User from 'UTIL/user'
import './list.less'
import { useChat } from 'UTIL/chat-controller'
import { usePageForword } from 'ROUTER/hooks'
import api from 'API/index'
import notificationApi from 'COMPONENTS/notification'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'

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
    <div styleName="userlist-container">
      {
        users.map(user => (
          <div onClick={() => { goUserDetail(user.userId) }} key={user.userId} styleName="userlist-item">
            <img src={user.avatarUrl + '?param=100y100'} alt=""/>
            <div styleName="userlist-item-info">
              <div styleName="userlist-item-name">{user.nickname}</div>
              <div styleName="userlist-item-signature">{user.signature}</div>
              <div styleName="userlist-item-count">
                <span>歌单：{user.playlistCount}</span>
                <span>粉丝：{user.followeds}</span>
              </div>
            </div>
            <div styleName="userlist-option">
              {
                type === 'follows' ?
                <Button icon={<Icon name="icon-email"></Icon>} onClick={(e) => { e.stopPropagation(); setCurrentChat(user) }}>私信</Button>
                :
                <Button icon={<Icon name={user.followed ? 'icon-gou' : 'icon-add'}></Icon>} onClick={(e) => { e.stopPropagation(); follow(user) }}>{user.followed ? '已关注' : '关注'}</Button>
              }
            </div>
          </div>
        ))
      }
    </div>
  )
}

export default UserList