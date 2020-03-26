import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './add-playlist-dialog.less'
import { UseDialogProps } from '..'

const AddPlaylistDialog: React.SFC<UseDialogProps> = (props) => {

  return (
    <Dialog width={470} {...props}>
      <div className="add-playlist-dialog-wrap">
        <div className="dialog-title">新建歌单</div>
        <div className="login-dialog-form-item">
          <input placeholder="请输入新歌单标题"/>
        </div>
        <div>
          <span></span>设置为隐私歌单
        </div>
        <div>创建</div>
      </div>
    </Dialog>
  )
}

export default AddPlaylistDialog