import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './share-dialog.less'
import { UseDialogProps } from '..'
import Icon from 'COMPONENTS/icon/icon'
import { createActivityPublishDialog } from 'COMPONENTS/dialog/create'
import { ShareType } from 'COMPONENTS/dialog/activity-publish/activity-publish'

export interface ShareDialogProps {
  type: ShareType
  shareContent: any
}

const ShareDialog: React.SFC<ShareDialogProps & UseDialogProps> = (props) => {
  const openActivityPublishDialog = createActivityPublishDialog()

  function handleActivityClick () {
    openActivityPublishDialog({ shareContent: props.shareContent, type: props.type })
    props.close()
  }

  return (
    <Dialog {...props} width={360}>
      <div>
        <div className="dialog-title">分享</div>
        <div className="share-dialog-container">
          <div onClick={handleActivityClick} className="share-dialog-item">
            <span className="share-dialog-item-icon activity">
              <Icon name="icon-neteastmusic"></Icon>
            </span>
            <span className="share-dialog-item-text">分享到云音乐动态</span>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareDialog