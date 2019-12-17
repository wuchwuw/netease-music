import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import login_dialog_img from 'ASSETS/images/login_dialog_img.png'
import './login-dialog.less'
import { UseDialogProps } from '..'

const LoignDialog: React.SFC<UseDialogProps> = (props) => {
  return (
    <Dialog width={350} {...props}>
      <div className="login-dialog-wrap">
        <img className="login-dialog-img" src={login_dialog_img} alt=""/>
        <div className="login-dialog-form">
          <div className="login-dialog-form-item">
            <i className="iconfont icon-phone"></i><input placeholder="请输入手机号" type="text"/>
          </div>
          <div className="login-dialog-form-item">
            <i className="iconfont icon-lock"></i>
            <input placeholder="请输入密码" type="text"/>
          </div>
        </div>
        <div className="login-dialog-btn">登录</div>
        <div className="login-dialog-tip">1、本项目仅为学习用途，不会保存任何用户的相关信息，请放心使用。</div>
        <div className="login-dialog-tip">2、如不想使用以上登录方式，您可以前往<span>网易云音乐个人主页</span>，登录并复制链接上的UID，
          <span>使用UID</span>仍然可以正常获取个人歌单等信息，不过部分需要登录的功能将无法使用。
        </div>
      </div>
    </Dialog>
  )
}

export default LoignDialog