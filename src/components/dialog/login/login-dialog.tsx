import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import login_dialog_img from 'ASSETS/images/login_dialog_img.png'
import './login-dialog.less'
import { UseDialogProps } from '..'
import api from 'API/index'
import { SET_LOGIN_STATUS, SET_USER_PROFILE, SET_USER_PLAYLIST } from 'STORE/user/types'
import { useDispatch } from 'react-redux'
import User from 'UTIL/user'
import { createBasePlaylist } from 'UTIL/playlist'
import { useFavorite } from 'UTIL/favorite'

const LoignDialog: React.SFC<UseDialogProps> = (props) => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { getFavoriteIds } = useFavorite()

  async function login () {
    try {
      const res = await api.login({ phone, password })
      const user = new User(res.data.profile)
      const { data: { playlist } } = await api.getUserPlaylist({ uid: user.userId })
      if (playlist.length) {
        playlist[0].name = '我喜欢的音乐'
        dispatch({ type: SET_USER_PLAYLIST, playlist: createBasePlaylist(playlist)})
        getFavoriteIds(user.userId)
      }
      dispatch({ type: SET_LOGIN_STATUS, isLogin: true })
      dispatch({ type: SET_USER_PROFILE, user: new User(res.data.profile) })
      props.close()
    } catch (e) {}
  }

  return (
    <Dialog width={350} {...props}>
      <div className="login-dialog-wrap">
        <img className="login-dialog-img" src={login_dialog_img} alt=""/>
        <div className="login-dialog-form">
          <div className="login-dialog-form-item">
            <i className="iconfont icon-phone"></i>
            <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder="请输入手机号" type="text"/>
          </div>
          <div className="login-dialog-form-item">
            <i className="iconfont icon-lock"></i>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="请输入密码"/>
          </div>
        </div>
        <div className="login-dialog-btn" onClick={() => { login() }}>登录</div>
        <div className="login-dialog-tip">1、本应用仅为学习用途，不会保存任何用户的相关信息，请放心使用。</div>
        <div className="login-dialog-tip">2、如不想使用以上登录方式，您可以前往<span>网易云音乐个人主页</span>，登录并复制链接上的UID，
          <span>使用UID</span>仍然可以正常获取个人歌单等信息，不过部分需要登录的功能将无法使用。
        </div>
      </div>
    </Dialog>
  )
}

export default LoignDialog