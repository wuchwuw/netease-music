import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API/index'
import Pagination from 'COMPONENTS/pagination/pagination'
import Spin from 'COMPONENTS/spin/spin'
import CommentCls, { createCommentList } from 'UTIL/comment'

interface CommentProps {
  id: number | string
  type: string
  showTitle?: boolean
  delay?: number
}

const COMMENT_TYPE_MAP = ['music', 'mv', 'playlist', 'album', 'dj', 'video', 'activity']

const Comment: React.SFC<CommentProps> = ({ id, type, showTitle = false, delay = 0}) => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<CommentCls[]>([])
  const [hot, setHot] = useState<CommentCls[]>([])
  const PAGE_SIZE = 30
  const [content, setContent] = useState('')

  useEffect(() => {
    if (!id) return
    delay ? setTimeout(() => { getComment() }, delay) : getComment()
  }, [id])

  async function getComment () {
    setLoading(true)
    const params = {
      type: type,
      params: {
        [type === 'event' ? 'threadId' : 'id']: id,
        limit: type === 'event' ? 10 : PAGE_SIZE
      }
    }

    try {
      const res = await api.getComment(params)
      setList(createCommentList(res.data.comments))
      setHot(createCommentList(res.data.hotComments))
      setTotal(res.data.total)
      setLoading(false)
    } catch (e) {}
  }

  async function sendComment (isReplied: boolean, commentId?: number) {
    try {
      let params = {
        t: isReplied ? 2 : 1,
        content,
        type: COMMENT_TYPE_MAP.indexOf(type),
        [ type === 'activity' ? 'threadId' : 'id']: id
      }
      isReplied && commentId && (params.commentId = commentId)
      const res = await api.sendComment(params)
      list.unshift(new CommentCls(res.data.comment))
      setList([...list])
    } catch (e) {}
  }

  async function commentLike (comment: CommentCls) {
    try {
      const t = comment.liked ? 0 : 1
      await api.commentLike({id, t, type: COMMENT_TYPE_MAP.indexOf(type), cid: comment.commentId})
      comment.liked = !comment.liked
      comment.likedCount = comment.liked ? ++comment.likedCount : --comment.likedCount
      setList([...list])
    } catch (e) {}
  }

  function genCommentNode (title: string, list: CommentCls[]) {
    return (
      <>
        <div className="comment-title">{title}</div>
        <div className="comment-list">
          {
            list.map(comment => (
              <div key={comment.commentId + comment.parentCommentId} className="comment-item">
                <img className="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=100y100'} alt=""/>
                <div className="comment-item-info">
                  <div className="comment-item-info-text">
                    <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}
                  </div>
                  {
                    comment.replied && (
                      <div className="comment-item-info-replay">
                        <div className="comment-item-info-text">
                          <span className="comment-item-info-name">@{comment.replied.user.nickname}:&nbsp;</span>{comment.replied.content}
                        </div>
                      </div>
                    )
                  }
                  <div className="comment-item-info-action">
                    <span className="comment-item-info-time">{comment.timeFormat}</span>
                    {/* <span className="comment-item-info-action-report">举报</span> */}
                    <i className={`iconfont icon-zan ${comment.liked ? 'active' : ''}`} onClick={() => { commentLike(comment) }}>
                      { !!comment.likedCount && <span className="comment-item-info-like">{comment.likedCount}</span>}
                    </i>
                    <i className="iconfont icon-share"></i>
                    <i className="iconfont icon-comment"></i>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      </>
    )
  }

  return (
    <div>
      { showTitle && <div className="comment-count">听友评论<span>(已有{total}条评论)</span></div> }
      <div className="comment-textarea-wrap">
        <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className="comment-textarea" placeholder="输入评论或@朋友"></textarea>
        <span className="comment-textarea-reset">140</span>
      </div>
      <div className="comment-textarea-action">
        <i className="iconfont icon-face"></i>
        <i className="iconfont icon-aite"></i>
        <i className="iconfont icon-addtag"></i>
        <span onClick={() => { sendComment(false) }} className="comment-textarea-action-btn">评论</span>
      </div>
      <div className="comment-content">
        <Spin loading={loading} delay={300}>
          {
            list.length ? (
              <>
                {
                  !!hot.length &&
                  <div className="comment-hot">
                    {genCommentNode('精彩评论', hot)}
                  </div>
                }
                <div className="comment-new">
                  {genCommentNode('最新评论', list)}
                  {
                    total >= PAGE_SIZE &&
                    <div className="pagination-wrap">
                      <Pagination total={total} pageSize={PAGE_SIZE} onChange={() => {}}></Pagination>
                    </div>
                  }
                </div>
              </>
            )
            :
            <div className="comment-nodata">还没有评论，快来抢沙发~</div>
          }
        </Spin>
      </div>
    </div>
  )
}

export default Comment