import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './add-playlist-dialog.less'
import { UseDialogProps } from '..'
import classnames from 'classnames'
import api from 'API/index'

const AddPlaylistDialog: React.SFC<UseDialogProps> = (props) => {
  const [isPersonal, setIsPersonal] = useState(false)
  const [name, setName] = useState('')

  async function addPlaylist () {
    try {
      await api.addPlaylist({
        name,
        privacy: isPersonal ? 10 : ''
      })
    } catch (e) {}
  }

  return (
    <Dialog width={470} {...props}>
      <div className="add-playlist-dialog-wrap">
        <div className="dialog-title">新建歌单</div>
        <div className="add-playlist-dialog-form-item">
          <input onChange={(e) => { setName(e.target.value) }} placeholder="请输入新歌单标题"/>
        </div>
        <div className="add-playlist-checkbox-wrap">
          <span
            onClick={() => { setIsPersonal(isPersonal => !isPersonal) }}
            className={classnames('add-playlist-checkbox', { 'active': isPersonal })}>
          </span>
          设置为隐私歌单
        </div>
        <div onClick={() => { addPlaylist() }} className="add-playlist-button">创建</div>
      </div>
    </Dialog>
  )
}

export default AddPlaylistDialog