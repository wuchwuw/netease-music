import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './create-playlist-dialog.less'
import { UseDialogProps } from '..'
import classnames from 'classnames'
import Button from 'COMPONENTS/button/button'
import { useUserPlaylist } from 'UTIL/user-playlist'

const CreatePlaylistDialog: React.SFC<UseDialogProps> = (props) => {
  const [isPersonal, setIsPersonal] = useState(false)
  const [name, setName] = useState('')
  const { createPlaylist } = useUserPlaylist()

  function addPlaylist () {
    createPlaylist(name, isPersonal, () => {
      props.close()
    })
  }

  return (
    <Dialog width={470} {...props}>
      <div>
        <div className="dialog-title">新建歌单</div>
        <div styleName="create-playlist-dialog-form-item">
          <input onChange={(e) => { setName(e.target.value) }} placeholder="请输入新歌单标题"/>
        </div>
        <div styleName="create-playlist-checkbox-wrap">
          <span
            onClick={() => { setIsPersonal(isPersonal => !isPersonal) }}
            styleName={classnames('create-playlist-checkbox', { 'active': isPersonal })}>
          </span>
          设置为隐私歌单
        </div>
        <div styleName="create-playlist-button">
          <Button type="primary" onClick={() => { addPlaylist() }}>创建</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default CreatePlaylistDialog