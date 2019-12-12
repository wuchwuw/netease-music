import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API/index'
import dayjs from 'dayjs'

interface CommentProps {
  id: number
  type: string
}
const COMMENT_TYPE_MAP = ['music', 'mv', 'playlist', 'album', 'dj', 'video']

const Comment: React.SFC<CommentProps> = (props) => {
  const [ list, setList ] = useState([{
    user: {},
    beReplied: []
  }])
  const [ hot, setHot ] = useState([{
    user: {},
    beReplied: []
  }])
  useEffect(() => {
    // getHotComment()
    setTimeout(() => {
      getComment()
    }, 500);
  }, [])
  // async function getHotComment () {
  //   const params = {
  //     id: props.id,
  //     type: 2,
  //     limit: 10
  //   }
  //   try {
  //     const res = await api.getHotComment(params)
  //     setHot(res.data.hotComments)
  //   } catch (e) {}
  // }
  async function getComment () {
    const params = {
      type: props.type,
      params: {
        id: props.id,
        limit: 60
      }
    }
    try {
      const res = await api.getComment(params)
      setList(res.data.comments)
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
                  <img className="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=35y35'} alt=""/>
                  <div className="comment-item-info">
                 <div className="comment-item-info-text">
                    <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}</div>
                    {
                      !!comment.beReplied.length && (
                        <div className="comment-item-info-replay">
                          <div className="comment-item-info-text"><span className="comment-item-info-name">@{comment.beReplied[0].user.nickname}:&nbsp;</span>{comment.beReplied[0].content}</div>
                        </div>
                      )
                    }
                    <div className="comment-item-info-action">
                      <span className="comment-item-info-time">{dayjs(comment.time).format('YYYY年MM月DD日 HH:MM')}</span>
                      <span className="comment-item-info-action-report">举报</span>
                      <i className="iconfont icon-zan">
                        <span className="comment-item-info-like">{comment.likedCount}</span>
                      </i>
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
          <div className="comment-list">
          {
              list.map(comment => (
                <div key={comment.commentId} className="comment-item">
                  <img className="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=35y35'} alt=""/>
                  <div className="comment-item-info">
                 <div className="comment-item-info-text">
                    <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}</div>
                    {
                      !!comment.beReplied.length && (
                        <div className="comment-item-info-replay">
                          <div className="comment-item-info-text"><span className="comment-item-info-name">@{comment.beReplied[0].user.nickname}:&nbsp;</span>{comment.beReplied[0].content}</div>
                        </div>
                      )
                    }
                    <div className="comment-item-info-action">
                      <span className="comment-item-info-time">2010年1月22日 02:02</span>
                      <span className="comment-item-info-action-report">举报</span>
                      <i className="iconfont icon-zan">
                        <span className="comment-item-info-like">{comment.likedCount}</span>
                      </i>
                      <i className="iconfont icon-share"></i>
                      <i className="iconfont icon-comment"></i>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Comment