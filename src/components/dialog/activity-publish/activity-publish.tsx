import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './activity-publish.less'
import { UseDialogProps } from '..'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'

const ActivityPublish: React.SFC<UseDialogProps> = (props) => {
  const [content, setContent] = useState('')
  const [selected, setSelected] = useState(false)

  function search () {}

  return (
    <Dialog {...props} width={470}>
      <div className="dialog-title">分享</div>
      {
        !selected ? (
          <div>
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
            <div onClick={() => { setSelected(true) }} className="activity-dialog-add-content">
              <span className="activity-dialog-add-icon"><Icon fontSize={14} name="icon-neteastmusic"></Icon></span>
              <span className="activity-dialog-add-tip">给动态配上内容~</span>
              <Icon name="icon-add"></Icon>
            </div>
            <div className="activity-dialog-button-wrap"><Button type="primary">分享</Button></div>
          </div>
        )
        :
        (
          <div className="activity-dialog-search">
            <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
              <span className="activity-dialog-selected">
                <span>歌曲</span>
                <Icon fontSize={12} name="icon-triangle-full"></Icon>
              </span>
              <div className="activity-dialog-input-wrap">
                <Icon fontSize={13} name="icon-search"></Icon>
                <input placeholder="搜索分享的歌曲、歌手、专辑、歌单" type="text"/>
              </div>
            </div>

            {/* <span className="activity-dialog-selected">
              <span>歌曲</span>
              <Icon fontSize={12} name="icon-triangle-full"></Icon>
            </span> */}
            <div className="activity-dialog-search-content"></div>
            <div onClick={() => { setSelected(false) }} style={{display: 'flex', justifyContent: 'center'}}><Button type="primary">返回</Button></div>
          </div>
        )
      }
    </Dialog>
  )
}

export default ActivityPublish