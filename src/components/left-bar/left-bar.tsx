import React, { useState, useEffect } from 'react'
import './left-bar.less'
import { NavLink } from 'react-router-dom'
import { useDialog, LoginDialog } from 'COMPONENTS/dialog/index'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import api from 'API/index'

const LeftBar: React.SFC = (props) => {
  const dialogProps = useDialog()
  const user = useSelector((state: RootState) => state.user.user)
  const isLogin = useSelector((state: RootState) => state.user.isLogin)
  const [playlist, setPlaylist] = useState([])

  useEffect(() => {
    if (isLogin) {
      getUserPlaylist()
    }
  }, [])

  async function getUserPlaylist () {
    try {
      let res = await api.getUserPlaylist({ uid: user.userId })
      await api.getUserInfo()
    } catch (e) {}
  }

  return (
    <div className='leftbar-wrap'>
      {
        isLogin ?
        <div className="leftbar-user">
          <div className="leftbar-login"><img className="leftbar-login-avatar" src={user.avatarUrl+'?param=100y100'} alt=""/></div>{user.nickname}<span className="leftbar-triangle"></span>
        </div>
        :
        <div className="leftbar-user">
          <div className="leftbar-login" onClick={() => dialogProps.toggle()}><i className="iconfont icon-userlogin"></i></div>未登录<span className="leftbar-triangle"></span>
        </div>
      }
      <NavLink to={'/home'} activeClassName="active" className="leftbar-item">
        <i className="iconfont icon-neteastmusic" style={{ fontWeight: 100 }}></i>发现音乐
      </NavLink>
      <div className="leftbar-item"><i className="iconfont iconxinhao"></i>私人FM</div>
      <div className="leftbar-item"><i className="iconfont icon-mv"></i>视频</div>
      <div className="leftbar-item"><i className="iconfont iconfriend"></i>朋友</div>
      {/* <div className="leftbar-item-title">我的音乐</div>
      <div className="leftbar-item"><i className="iconfont iconfriend"></i>朋友</div> */}
      <div className="leftbar-item-title">创建的歌单</div>
      <div className="leftbar-item"><i className="iconfont iconxin"></i>我喜欢的音乐</div>
      <LoginDialog {...dialogProps}></LoginDialog>
    </div>
  )
}

export default LeftBar