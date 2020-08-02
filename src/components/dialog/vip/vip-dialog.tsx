import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './vip-dialog.less'
import { UseDialogProps } from '..'
import Button from 'COMPONENTS/button/button'

export enum VipDialogType {
  Song = 'song',
  BuyPlaylist = 'buyPlaylist'
}

export interface VipDialogProps {
  type: VipDialogType
  albumId?: number
}

const VipDialog: React.SFC<UseDialogProps & VipDialogProps> = (props) => {

  function vipDialogText () {
    switch(props.type) {
      case VipDialogType.Song:
        return '应版权方要求，该歌曲仅限开通VIP使用'
      case VipDialogType.BuyPlaylist:
        return '版权方要求，当前专辑需单独付费，购买数字专辑即可无限畅享'
    }
  }

  function vipDialogButtonText () {
    switch(props.type) {
      case VipDialogType.Song:
        return '开通音乐包'
      case VipDialogType.BuyPlaylist:
        return '购买专辑'
    }
  }

  function handleClick () {
    switch(props.type) {
      case VipDialogType.Song:
        window.open('https://music.163.com/#/member')
        break
      case VipDialogType.BuyPlaylist:
        window.open(`https://music.163.com/store/newalbum/detail?id=${props.albumId}`)
        break
    }
  }

  return (
    <Dialog {...props} width={300}>
      <div styleName="vip-dialog-pay">
        <div styleName="vip-dialog-content">
          <div styleName="vip-dialog-pay-text">{vipDialogText()}</div>
          <Button block={true} type="primary" onClick={() => { handleClick() }}>{vipDialogButtonText()}</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default VipDialog