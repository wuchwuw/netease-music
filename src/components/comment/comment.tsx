import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API'

// interface LeftBarProps {
//   setTab: React.Dispatch<React.SetStateAction<string>>
// }
const COMMENT_TYPE_MAP = ['song', 'mv', 'playlist', 'album', 'radio', 'video']

const Comment: React.SFC = (props) => {
  console.log(props)
  const [ list, setList ] = useState([])
  const [ hot, setHot ] = useState([{
    user: {}
  }])
  useEffect(() => {
    console.log(1)
    getHotComment()
  }, [])
  async function getHotComment () {
    const params = {
      id: props.id,
      type: 2
    }
    try {
      const res = await api.getHotComment(params)
      setHot(res.data.hotComments)
    } catch (e) {}
  }
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
            {
              hot.map(comment => (
                <div key={comment.commentId} className="comment-item">
                  <img className="comment-item-user-avatar" src={comment.user.avatarUrl} alt=""/>
                  <div className="comment-item-info">
              <div className="comment-item-info-text">
                <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}</div>
                    <div className="comment-item-info-replay">
                      <div className="comment-item-info-text"><span className="comment-item-info-name">@阿斯达十大ad:&nbsp;</span>这可不小众</div>
                    </div>
                    <div className="comment-item-info-action">
                      <span className="comment-item-info-time">2010年1月22日 02:02</span>
                      <span className="comment-item-info-action-report">举报</span>
                      <i className="iconfont icon-zan">1</i>
                      <i className="iconfont icon-share"></i>
                      <i className="iconfont icon-comment"></i>
                    </div>
                  </div>
                </div>
              ))
            }
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