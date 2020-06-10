import React, { useState } from 'react'
import './playlist-edit.less'
import AddPlaylistTag from 'VIEWS/playlist/add-playlist-tag'
import Button from 'COMPONENTS/button/button'

const PlylistEdit = () => {
  const [phone, setPhone] = useState('')
  return (
    <div className="playlist-edit-container">
      <div className="playlist-edit-title">编辑歌单信息</div>
      <div className="playlist-form">
        <div className="playlist-form-item">
          <span>歌单名:</span>
          <input value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder="请输入手机号" type="text"/>
        </div>
        <div className="playlist-form-item">
          <span>标签:</span>
          <AddPlaylistTag><span className="playlist-form-addtag">添加标签</span></AddPlaylistTag>
        </div>
        <div className="playlist-form-item">
          <span>简介:</span>
          <textarea rows={5} value={phone} onChange={(e) => { setPhone(e.target.value) }} placeholder="请输入手机号"/>
        </div>
        <div className="playlist-form-button">
          <Button type="primary">保存</Button>
          <Button>取消</Button>
        </div>
      </div>
      <img className="playlist-edit-cover" src="http://p2.music.126.net/wKxBnoApLQj2Rmf2jd69OA==/19099616486753304.jpg?param=300y300" alt=""/>
    </div>
  )
}

export default PlylistEdit