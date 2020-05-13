import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './comment-dialog.less'
import { UseDialogProps } from '../../dialog'

const CommentDialog: React.SFC<UseDialogProps> = (props) => {
  const [content, setContent] = useState('')

  return (
    <Dialog width={470} {...props}>
      <div className="comment-dialog">
        <div className="dialog-title">评论</div>
        <div className="comment-textarea-wrap">
          <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className="comment-textarea" placeholder="输入评论或@朋友"></textarea>
          <span className="comment-textarea-reset">140</span>
        </div>
        <div className="comment-textarea-action">
          <i className="iconfont icon-face"></i>
          <i className="iconfont icon-aite"></i>
          <i className="iconfont icon-addtag"></i>
          <span onClick={() => {}} className="comment-textarea-action-btn">评论</span>
        </div>
      </div>
    </Dialog>
  )
}

export default CommentDialog