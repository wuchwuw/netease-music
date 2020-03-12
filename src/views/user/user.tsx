import React, { useEffect, useState } from 'react'
import './user.less'
import { useParams } from 'react-router'
import api from 'API/index'
import { createPlaylistList, PlaylistClass } from 'UTIL/playlist'
import UserClass, { createUserDetail } from 'UTIL/user'
import classNames from 'classnames'

const User = () => {
  const { id } = useParams()
  const userId = Number(id)
  const [userPlaylist, setUserPlaylist] = useState<PlaylistClass[]>([])
  const [userSubPlaylist, setSubUserPlaylist] = useState<PlaylistClass[]>([])
  const [user, setUser] = useState<UserClass>(createUserDetail({}))
  useEffect(() => {
    getUserDetail()
    getUserPlaylist()
  }, [])

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
      console.log(res.data.playlist)
      setUserPlaylist(playlist.filter(item => item.creator.userId === userId))
      setSubUserPlaylist(playlist.filter(item => item.creator.userId !== userId))
    } catch (e) { console.log(e) }
  }

  function genUserTag (user: UserClass) {
    let auth = user.allAuthTypes
    let tags: React.ReactElement[] = []
    if (auth) {
      auth.forEach(item => {
        if (item.type === 4) {
          tags.push(<span className="user-tag-music"><i className="iconfont icon-neteastmusic"></i>{item.desc}</span>)
        } else if (item.type === 201) {
          tags.push(<span className="user-tag-video"><i className="iconfont icon-star"></i>{item.desc}</span>)
        } else if (item.desc){
          tags.push(<span className="user-tag-music">{item.desc}</span>)
        }
      })
    }
    tags.push(<span className="user-tag-level">Lv.{user.level}</span>)
    tags.push(
      <span className={user.gender === 1 ? 'user-tag-boy' : 'user-tag-girl'}>
        <i className={classNames('iconfont', user.gender === 1 ? 'icon-boy' : 'icon-girl')}></i>
      </span>
    )
    return tags
  }

  return (
    <div className="user-container">
      <div className="user-info-wrap">
        <img className="user-info-avatar" src={user.avatarUrl} alt=""/>
        <div className="user-info">
          <div className="user-info-name">{user.nickname}</div>
          <div className="user-tag-wrap">
            <div className="user-tag">
              { genUserTag(user) }
            </div>
            <div className="user-option">
              <span><i className="iconfont icon-artist"></i>歌手页</span>
              <span><i className="iconfont icon-email"></i>发私信</span>
              <span><i className="iconfont icon-add"></i>关注</span>
            </div>
          </div>
          <div className="user-social">
            <div className="user-social-item">
              <div>{user.eventCount}</div>
              <div>动态</div>
            </div>
            <div className="user-social-item">
              <div>{user.follows}</div>
              <div>关注</div>
            </div>
            <div className="user-social-item">
              <div>{user.followeds}</div>
              <div>粉丝</div>
            </div>
          </div>
          <div>
            {/* <div className="user-other">
              <span>所在地区:</span>
              <span>湖南省 长沙市</span>
            </div>
            <div className="user-other">
              <span>社交网络:</span>
              <span>湖南省 长沙市</span>
            </div> */}
            <div className="user-other">
              <span>个人介绍：</span>
              <span>{user.signature}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="user-playlist">
        <div className="user-playlist-title">
          歌单<span>({userPlaylist.length})</span>
        </div>
        <div className="commen-area-content">
          {
            userPlaylist.map(item => (
              <div key={item.id} className="commen-area-item commen-area-item-album">
                <div className="commen-area-img-wrap">
                  <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <img src={item.coverImgUrl + '?param=130y130'} alt=""/>
                  <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
                </div>
                <div className="commen-area-text">{item.name}</div>
                <div className="commen-area-artist">{item.trackCount + '首'}</div>
              </div>
            ))
          }
        </div>
      </div>
      <div className="user-star">
        <div className="user-playlist-title">
          收藏<span>({userSubPlaylist.length})</span>
        </div>
        <div className="commen-area-content">
          {
            userSubPlaylist.map(item => (
              <div key={item.id} className="commen-area-item commen-area-item-album">
                <div className="commen-area-img-wrap">
                  <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                  <img src={item.coverImgUrl + '?param=130y130'} alt=""/>
                  <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
                </div>
                <div className="commen-area-text">{item.name}</div>
                <div className="commen-area-artist">{item.trackCount + '首'}</div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default User