import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './activity-publish.less'
import { UseDialogProps } from '..'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'

const ActivityPublish: React.SFC<UseDialogProps> = (props) => {
  const [content, setContent] = useState('')
  return (
    <Dialog {...props} width={470}>
      <div>
        <div className="dialog-title">分享</div>
        <div className="activity-dialog-textarea-wrap">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value) }}
            className="activity-dialog-textarea"
            placeholder="一起聊聊音乐吧~"
            rows={8}
          >
          </textarea>
          <div className="activity-dialog-textarea-option">
            <Icon name="icon-face" fontSize={18}></Icon>
            <Icon name="icon-aite" fontSize={18}></Icon>
            <Icon name="icon-addtag" fontSize={18}></Icon>
            <span className="activity-dialog-textarea-reset">140</span>
          </div>
        </div>
        <div className="activity-dialog-add-content">给动态添加音乐</div>
        <div><Button type="primary">分享</Button></div>
      </div>
    </Dialog>
  )
}

export default ActivityPublish