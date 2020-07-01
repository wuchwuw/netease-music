import React, { useEffect, useState } from 'react'
import './user.less'
import { useParams } from 'react-router'
import api from 'API/index'
import { createPlaylistList, PlaylistClass } from 'UTIL/playlist'
import UserClass, { createUserDetail } from 'UTIL/user'
import classNames from 'classnames'
import { usePageForword } from 'ROUTER/hooks'
import { useChat } from 'UTIL/chat-controller'
import notificationApi from 'COMPONENTS/notification'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'

const User = () => {
  const { id } = useParams()
  const userId = Number(id)
  const u = useSelector((state: RootState) => state.user.user)
  const [userPlaylist, setUserPlaylist] = useState<PlaylistClass[]>([])
  const [userSubPlaylist, setSubUserPlaylist] = useState<PlaylistClass[]>([])
  const [user, setUser] = useState<UserClass>(createUserDetail({}))
  const {
    goArtistDetail,
    goPlaylistDetail,
    goUserEdit,
    goUserFollow,
    goUserFollowed,
    goUserEvent
  } = usePageForword()
  const { setCurrentChat } = useChat()
  useEffect(() => {
    getUserDetail()
    getUserPlaylist()
  }, [userId])

  async function getUserDetail () {
    try {
      const res = await api.getUserDetail({ uid:userId })
      setUser(createUserDetail(res.data))
    } catch (e) { console.log(e) }
  }

  async function getUserPlaylist () {
    try {
      const res = await api.getUserPlaylist({ uid: userId })
      const playlist = createPlaylistList(res.data.playlist)
      setUserPlaylist(playlist.filter(item => item.creator.userId === userId))
      setSubUserPlaylist(playlist.filter(item => item.creator.userId !== userId))
    } catch (e) {}
  }

  function genUserTag (user: UserClass) {
    let auth = user.allAuthTypes
    let tags: React.ReactElement[] = []
    if (auth) {
      auth.forEach(item => {
        if (item.type === 4) {
          tags.push(<span styleName="user-tag-music"><Icon name="icon-neteastmusic"></Icon>{item.desc}</span>)
        } else if (item.type === 201) {
          tags.push(<span styleName="user-tag-video"><Icon name="icon-star"></Icon>{item.desc}</span>)
        } else if (item.desc){
          tags.push(<span styleName="user-tag-music">{item.desc}</span>)
        }
      })
    }
    tags.push(<span styleName="user-tag-level">Lv.{user.level}</span>)
    if (user.gender > 0) {
      tags.push(
        <span styleName={user.gender === 1 ? 'user-tag-boy' : 'user-tag-girl'}>
          <Icon name={user.gender === 1 ? 'icon-boy' : 'icon-girl'}></Icon>
        </span>
      )
    }
    return tags
  }

  async function follow () {
    try {
      const t = user.followed ? 2 : 1
      await api.userFollow({ t, id: user.userId })
      notificationApi.success({ content: user.followed ? '已取消关注' : '关注成功' })
      getUserDetail()
    } catch (e) {}
  }

  function genUserOption () {
    if (!user.userId) return null
    if (userId === u.userId) {
      return (
        <div styleName="user-option">
          <Button onClick={() => { goUserEdit() }} icon={<Icon name="icon-share"></Icon>}>编辑个人资料</Button>
        </div>
      )
    } else {
      return (
        <div styleName="user-option">
          { !!user.artistId && <Button icon={<Icon style={{marginRight: '3px'}} name="icon-artist"></Icon>} onClick={() => { goArtistDetail(user.artistId) }}>歌手页</Button>}
          <Button icon={<Icon style={{marginRight: '3px'}} name="icon-email"></Icon>} onClick={() => { setCurrentChat(user) }}>发私信</Button>
          <Button
            icon={<Icon style={{marginRight: '3px'}} name={user.followed ? 'icon-gou' : 'icon-add'}></Icon>}
            onClick={() => { follow() }}
          >
            {user.followed ? '已关注' : '关注'}
          </Button>
        </div>
      )
    }
  }

  return (
    <div styleName="user-container">
      <div styleName="user-info-wrap">
        <div styleName="user-info-avatar" style={{backgroundImage: `url(${user.avatarUrl})`}}></div>
        <div styleName="user-info">
          <div styleName="user-info-name">{user.nickname}</div>
          <div styleName="user-tag-wrap">
            <div styleName="user-tag">
              { genUserTag(user) }
            </div>
            {
              genUserOption()
            }
          </div>
          <div styleName="user-social">
            <div onClick={() => { goUserEvent(userId, { username: user.nickname }) }} styleName="user-social-item">
              <div>{user.eventCount}</div>
              <div>动态</div>
            </div>
            <div onClick={() => { goUserFollow(userId, { username: user.nickname }) }} styleName="user-social-item">
              <div>{user.follows}</div>
              <div>关注</div>
            </div>
            <div onClick={() => { goUserFollowed(userId, { username: user.nickname }) }} styleName="user-social-item">
              <div>{user.followeds}</div>
              <div>粉丝</div>
            </div>
          </div>
          <div>
            <div styleName="user-other">
              <span>所在地区：</span>
              <span>{user.provinceName} {user.cityName}</span>
            </div>
            {/* <div className="user-other">
              <span>社交网络:</span>
              <span>湖南省 长沙市</span>
            </div> */}
            <div styleName="user-other">
              <span>个人介绍：</span>
              <span>{user.signature}</span>
            </div>
          </div>
        </div>
      </div>
      <div styleName="user-playlist">
        <div styleName="user-playlist-title">
          歌单<span>({userPlaylist.length})</span>
        </div>
        <div className="commen-area-content">
          {
            userPlaylist.map(item => (
              <div key={item.id} className="commen-area-item commen-area-item-playlist">
                <div onClick={() => { goPlaylistDetail(item.id) }} className="commen-area-img-wrap">
                  <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                  <img src={item.coverImgUrl + '?param=130y130'} alt=""/>
                  <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{item.playCount_string}</div>
                </div>
                <div onClick={() => { goPlaylistDetail(item.id) }} className="commen-area-text">{item.name}</div>
                <div className="commen-area-artist">{item.trackCount + '首'}</div>
              </div>
            ))
          }
        </div>
      </div>
      {
        !!userSubPlaylist.length &&
        <div>
          <div styleName="user-playlist-title">
            收藏<span>({userSubPlaylist.length})</span>
          </div>
          <div className="commen-area-content">
            {
              userSubPlaylist.map(item => (
                <div key={item.id} className="commen-area-item commen-area-item-playlist">
                  <div onClick={() => { goPlaylistDetail(item.id) }} className="commen-area-img-wrap">
                    <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
                    <img src={item.coverImgUrl + '?param=130y130'} alt=""/>
                    <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{item.playCount_string}</div>
                  </div>
                  <div onClick={() => { goPlaylistDetail(item.id) }} className="commen-area-text">{item.name}</div>
                  <div className="commen-area-artist">{item.trackCount + '首'}</div>
                </div>
              ))
            }
          </div>
        </div>
      }
    </div>
  )
}

export default User