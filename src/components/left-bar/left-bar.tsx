import React from 'react'
import './left-bar.less'
import { NavLink } from 'react-router-dom'
import { useDialog, LoginDialog } from 'COMPONENTS/dialog/index'

const LeftBar: React.SFC = (props) => {
  const dialogProps = useDialog()

  return (
    <div className='leftbar-wrap'>
      <div className="leftbar-user">
        <div className="leftbar-login" onClick={() => dialogProps.toggle()}><i className="iconfont icon-userlogin"></i></div>未登录<span className="leftbar-triangle"></span>
      </div>
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