import React from 'react'
import './comment.less'

// interface LeftBarProps {
//   setTab: React.Dispatch<React.SetStateAction<string>>
// }

const Comment: React.SFC = (props) => {
  return (
    <div>
      <div className="comment-textarea-wrap">
        <textarea className="comment-textarea" placeholder="输入评论或@朋友" name=""></textarea>
        <span className="comment-textarea-reset">140</span>
      </div>
      <div className="comment-textarea-action">
        <i className="iconfont icon-face"></i>
        <i className="iconfont icon-aite"></i>
        <i className="iconfont icon-addtag"></i>
        <span className="comment-textarea-action-btn">评论</span>
      </div>
      <div className="comment-content">
        <div className="comment-hot">
          <div className="comment-title">精彩评论</div>
          <div className="comment-list">
            <div className="comment-item">
              <img className="comment-item-user-avatar" src="http://p1.music.126.net/VFd5cboNTbnYsWZ5DBn9bg==/18953381440004340.jpg" alt=""/>
              <div className="comment-item-info">
                <div className="comment-item-info-text"><span className="comment-item-info-name">阿斯达十大ad:</span>这可不小众</div>
                <div className="comment-item-info-action">
                  <span className="comment-item-info-time">2010年1月22日 02:02</span>
                  <span>举报</span>
                  <i className="iconfont icon-zan">1</i>
                  <i className="iconfont icon-share"></i>
                  <i className="iconfont icon-comment"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="comment-new">
          <div className="comment-title">最新评论</div>
          <div className="comment-list"></div>
        </div>
      </div>
    </div>
  )
}

export default Comment