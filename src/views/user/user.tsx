import React, { useEffect, useState } from 'react'
import './user.less'
import { useParams } from 'react-router'
import api from 'API/index'
import { createPlaylistList, PlaylistClass } from 'UTIL/playlist'

const User = () => {
  const { id } = useParams()
  const [userPlaylist, setUserPlaylist] = useState<PlaylistClass[]>([])
  useEffect(() => {
    getUserDetail()
    getUserPlaylist()
  }, [])

  async function getUserDetail () {
    try {
      const res = await api.getUserDetail({ uid: id })
      console.log(res)
    } catch (e) {}
  }

  async function getUserPlaylist () {
    try {
      const res = await api.getUserPlaylist({ uid: id })
      setUserPlaylist(createPlaylistList(res.data.playlist))
      console.log(userPlaylist)
    } catch (e) { console.log(e) }
  }

  return (
    <div className="user-container">
      <div className="user-info-wrap">
        <img className="user-info-avatar" src="http://p1.music.126.net/VlAoHWtmlpUZZyJrhSsS9Q==/109951164055939814.jpg?param=180y180" alt=""/>
        <div className="user-info">
          <div className="user-info-name">w_Dulcim</div>
          <div className="user-tag-wrap">
            <div className="user-tag">
              <span>网易音乐人</span>
              <span>音乐原创视频达人</span>
              <span>黑胶CVIP</span>
              <span>lv7</span>
              <span>女</span>
            </div>
            <div className="user-option">
              <span><i className="iconfont icon-star"></i>歌手页</span>
              <span><i className="iconfont icon-email"></i>发私信</span>
              <span><i className="iconfont icon-add"></i>关注</span>
            </div>
          </div>
          <div className="user-social">
            <div className="user-social-item">
              <div>80</div>
              <div>动态</div>
            </div>
            <div className="user-social-item">
              <div>80</div>
              <div>关注</div>
            </div>
            <div className="user-social-item">
              <div>8023232</div>
              <div>粉丝</div>
            </div>
          </div>
          <div>
            <div className="user-other">
              <span>所在地区:</span>
              <span>湖南省 长沙市</span>
            </div>
            <div className="user-other">
              <span>社交网络:</span>
              <span>湖南省 长沙市</span>
            </div>
            <div className="user-other">
              <span>个人介绍:</span>
              <span>是大神撒旦撒暗度</span>
            </div>
          </div>
        </div>
      </div>
      <div className="user-playlist">
        <div className="user-playlist-title">
          歌单
        </div>
        <div className="commen-video-content">
        {
          userPlaylist.map(item => (
            <div key={item.id} className="commen-video-item commen-video-item-album">
              <div className="commen-video-img-wrap">
                <div className="commen-video-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                <img src={item.coverImgUrl + '?param=130y130'} alt=""/>
                <div className="commen-video-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
              </div>
              <div className="commen-video-text">{item.name}</div>
              <div className="commen-video-artist">{item.trackCount + '首'}</div>
            </div>
          ))
        }
        </div>
      </div>
    </div>
  )
}

export default User