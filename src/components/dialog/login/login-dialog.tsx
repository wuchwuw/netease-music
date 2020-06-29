import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import login_dialog_img from 'ASSETS/images/login_dialog_img.png'
import './login-dialog.less'
import { UseDialogProps } from '..'
import api from 'API/index'
import { SET_LOGIN_STATUS, SET_USER_PROFILE } from 'STORE/user/types'
import { useDispatch, useSelector } from 'react-redux'
import User from 'UTIL/user'
import { useFavorite } from 'UTIL/favorite'
import { useUserPlaylist } from 'UTIL/user-playlist'
import { RootState, store } from 'STORE/index'
import { SET_LOGIN_DIALOG_VISIBLE } from 'STORE/commen/types'


export function openLoginDialog () {
  store.dispatch({ type: SET_LOGIN_DIALOG_VISIBLE, loginDialogVisible: true })
}

const LoignDialog = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { getFavoriteIds } = useFavorite()
  const { getUserPlaylist } = useUserPlaylist()
  const loginDialogVisible = useSelector((state: RootState) => state.commen.loginDialogVisible)
  const dialogProps: UseDialogProps = {
    visible: loginDialogVisible,
    open: () => {
      dispatch({ type: SET_LOGIN_DIALOG_VISIBLE, loginDialogVisible: true })
    },
    close: () => {
      dispatch({ type: SET_LOGIN_DIALOG_VISIBLE, loginDialogVisible: false })
    },
    toggle: () => {}
  }

  async function login () {
    try {
      const res = await api.login({ phone, password })
      const user = new User(res.data.profile)
      getUserPlaylist(user.userId)
      getFavoriteIds(user.userId)
      dispatch({ type: SET_LOGIN_STATUS, isLogin: true })
      dispatch({ type: SET_USER_PROFILE, user: new User(res.data.profile) })
      dialogProps.close()
    } catch (e) {}
  }

  return (
    <Dialog width={350} {...dialogProps}>
      <div styleName="login-dialog-wrap">
        <img styleName="login-dialog-img" src={login_dialog_img} alt=""/>
        <div styleName="login-dialog-form">
          <div styleName="login-dialog-form-item">
            <i className="iconfont icon-phone"></i>
            <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder="请输入手机号" type="text"/>
          </div>
          <div styleName="login-dialog-form-item">
            <i className="iconfont icon-lock"></i>
            <input type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} placeholder="请输入密码"/>
          </div>
        </div>
        <div styleName="login-dialog-btn" onClick={() => { login() }}>登录</div>
        <div styleName="login-dialog-tip">本应用仅为学习用途，不会保存任何用户的相关信息，请放心使用。</div>
      </div>
    </Dialog>
  )
}

export default LoignDialog