import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './vip-dialog.less'
import { UseDialogProps } from '..'
import vipDialogBackground from 'ASSETS/images/buy_vip_bg.jpg'
import Button from 'COMPONENTS/button/button'


const VipDialog: React.SFC<UseDialogProps> = (props) => {
  const [isPaying, setIsPaying] = useState(false)
  return (
    <Dialog {...props}>
      {
        !isPaying ?
        <div className="vip-dialog-pay">
          <div className="vip-dialog-background"></div>
          <div className="vip-dialog-content">
            <div className="vip-dialog-pay-text">版权方要求，该歌曲仅限开通VIP使用</div>
            <Button block={true} type="primary" onClick={() => { window.open('https://music.163.com/#/member') }}>开通音乐包</Button>
          </div>
        </div>
        :
        (<div></div>)
      }
    </Dialog>
  )
}

export default VipDialog