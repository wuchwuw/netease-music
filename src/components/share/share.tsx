import React from 'react'
import Button from 'COMPONENTS/button/button'
import './share.less'
import { useContainer } from 'COMPONENTS/container/container'
import Icon from 'COMPONENTS/icon/icon'
import { useCreateDialog, SHARE_ACTIVITY_DIALOG } from 'COMPONENTS/dialog/create'

interface ShareProps {
  count: number
  type: string
  shareContent: any
}

const Share: React.SFC<ShareProps> = ({
  count = 0,
  type,
  shareContent
}) => {
  const {visiable, open} = useContainer([])
  const { open: shareOpen } = useCreateDialog(SHARE_ACTIVITY_DIALOG)
  return (
    <span onClick={open} className="share-container">
      <Button>分享({count})</Button>
     {
       visiable && (
        <div className="share-type">
          <div onClick={() => { shareOpen({ type, shareContent }) }} className="share-type-item">
            <span className="share-type-icon activity"><Icon fontSize={12} name="icon-neteastmusic"></Icon></span>
            分享到动态
          </div>
          {/* <div className="share-type-item">
            <span className="share-type-icon wechat"><Icon fontSize={12} name="icon-neteastmusic"></Icon></span>
            分享到微信
          </div>
          <div className="share-type-item">
            <span className="share-type-icon link"><Icon name="icon-link"></Icon></span>
            复制链接
          </div> */}
        </div>
       )
     }
    </span>
  )
}

export default Share