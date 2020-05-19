import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API/index'
import Pagination from 'COMPONENTS/pagination/pagination'
import Spin from 'COMPONENTS/spin/spin'
import CommentCls, { createCommentList } from 'UTIL/comment'
import CommentDialog from './comment-dialog/comment-dialog'
import { useDialog } from 'COMPONENTS/dialog'
import classnames from 'classnames'

interface CommentProps {
  id: number | string
  type: string
  showTitle?: boolean
  delay?: number
  textareaType?: string
}

const COMMENT_TYPE_MAP = ['music', 'mv', 'playlist', 'album', 'dj', 'video', 'activity']

const Comment: React.SFC<CommentProps> = ({ id, type, showTitle = false, delay = 0, textareaType = 'normal' }) => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<CommentCls[]>([])
  const [hot, setHot] = useState<CommentCls[]>([])
  const PAGE_SIZE = 30
  const [content, setContent] = useState('')
  const commentDialogProps = useDialog()
  const [repliedIndex, setRepliedIndex] = useState('')
  const [repliedContent, setRepliedContent] = useState('')

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

  async function sendComment (commentId?: number, repliedData?: any) {
    try {
      let params = {
        t: commentId ? 2 : 1,
        content: commentId ? repliedContent: content,
        type: COMMENT_TYPE_MAP.indexOf(type),
        [ type === 'activity' ? 'threadId' : 'id']: id
      }
      commentId && (params.commentId = commentId)
      const res = await api.sendComment(params)
      list.unshift(new CommentCls(repliedData ? {...res.data.comment, beReplied: repliedData} : res.data.comment))
      setList([...list])
      if (commentId) {
        setRepliedIndex('')
        setRepliedContent('')
      }
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

  function showReplied (id: string) {
    if (id === repliedIndex) {
      setRepliedIndex('')
      setRepliedContent('')
    } else {
      setRepliedIndex(id)
    }
  }

  function genCommentNode (title: string, list: CommentCls[]) {
    return (
      <>
        <div className="comment-title">{title}</div>
        <div className="comment-list">
          {
            list.map((comment, index) => (
              <div key={comment.commentId + comment.parentCommentId} className="comment-item">
                <img className="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=100y100'} alt=""/>
                <div className="comment-item-info">
                  <div className="comment-item-info-text">
                    <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}
                  </div>
                  {
                    comment.replied && (
                      <div className="comment-item-info-replay">
                        <div className="comment-item-info-text replied">
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
                    <i onClick={() => { showReplied(`${title}-${index}`) }} className="iconfont icon-comment"></i>
                  </div>
                  {
                    repliedIndex === `${title}-${index}` && (
                      <>
                        <div className={ classnames('comment-textarea-wrap replied', { 'deep': textareaType === 'deep' })}>
                          <textarea 
                            value={repliedContent} 
                            onChange={(e) => { setRepliedContent(e.target.value) }} 
                            className="comment-textarea"
                            placeholder={`回复${comment.user.nickname}:`}
                          >
                          </textarea>
                          <span className="comment-textarea-reset">140</span>
                        </div>
                        <div className="comment-textarea-action">
                          <i className="iconfont icon-face"></i>
                          <i className="iconfont icon-aite"></i>
                          <i className="iconfont icon-addtag"></i>
                          <span onClick={() => { sendComment(comment.commentId, [{ beRepliedCommentId: comment.commentId, content: comment.content, user: comment.user }]) }} className="comment-textarea-action-btn">评论</span>
                        </div>
                      </>
                    )
                  }
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
      <div className={ classnames('comment-textarea-wrap', { 'deep': textareaType === 'deep' })}>
        <textarea 
          value={content} 
          onChange={(e) => { setContent(e.target.value) }} 
          className="comment-textarea" 
          placeholder="输入评论或@朋友"
        >
        </textarea>
        <span className="comment-textarea-reset">140</span>
      </div>
      <div className="comment-textarea-action">
        <i className="iconfont icon-face"></i>
        <i className="iconfont icon-aite"></i>
        <i className="iconfont icon-addtag"></i>
        <span onClick={() => { sendComment() }} className="comment-textarea-action-btn">评论</span>
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
      <CommentDialog {...commentDialogProps}></CommentDialog>
    </div>
  )
}

export default Comment