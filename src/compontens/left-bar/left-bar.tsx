import React from 'react'
import './left-bar.less'

export default function LeftBar () {
  return (
    <div className='leftbar-wrap'>
      <div className="leftbar-user">未登录</div>
      <div className="leftbar-item">发现音乐</div>
      <div className="leftbar-item">私人FM</div>
      <div className="leftbar-item">视频</div>
      <div className="leftbar-item">朋友</div>
      <div className="leftbar-item-title">创建的歌单</div>
    </div>
  )
}