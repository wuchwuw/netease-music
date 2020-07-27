import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './share-dialog.less'
import { UseDialogProps } from '..'
import Icon from 'COMPONENTS/icon/icon'
import { createActivityPublishDialog } from 'COMPONENTS/dialog/create'
import { SearchShare } from 'COMPONENTS/dialog/activity-publish/activity-publish'

export interface ShareDialogProps {
  share: SearchShare
}

const ShareDialog: React.SFC<ShareDialogProps & UseDialogProps> = (props) => {
  const openActivityPublishDialog = createActivityPublishDialog()

  function handleActivityClick () {
    openActivityPublishDialog({ share: props.share })
    props.close()
  }

  return (
    <Dialog {...props} width={360}>
      <div>
        <div className="dialog-title">分享</div>
        <div styleName="share-dialog-container">
          <div onClick={handleActivityClick} styleName="share-dialog-item">
            <span styleName="share-dialog-item-icon activity">
              <Icon name="icon-neteastmusic"></Icon>
            </span>
            <span styleName="share-dialog-item-text">分享到云音乐动态</span>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ShareDialog