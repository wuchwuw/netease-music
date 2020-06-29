import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API/index'
import Pagination from 'COMPONENTS/pagination/pagination'
import Spin from 'COMPONENTS/spin/spin'
import CommentCls, { createCommentList } from 'UTIL/comment'
import classnames from 'classnames'
import Icon from 'COMPONENTS/icon/icon'
import Button from 'COMPONENTS/button/button'

interface CommentProps {
  id: number | string
  type: string
  showTitle?: boolean
  delay?: number
  textareaType?: string
}

const COMMENT_TYPE_MAP = ['music', 'mv', 'playlist', 'album', 'dj', 'video', 'activity']
let offset = 0

const Comment: React.SFC<CommentProps> = ({ id, type, showTitle = false, delay = 0, textareaType = 'normal' }) => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<CommentCls[]>([])
  const [hot, setHot] = useState<CommentCls[]>([])
  const PAGE_SIZE = type === 'event' ? 10 : 20
  const [content, setContent] = useState('')
  const [repliedIndex, setRepliedIndex] = useState('')
  const [repliedContent, setRepliedContent] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    if (!id) return
    offset = 0
    setCurrentPage(1)
    delay ? setTimeout(() => { getComment() }, delay) : getComment()
  }, [id])

  async function getComment () {
    setLoading(true)
    const params = {
      type: type,
      params: {
        [type === 'event' ? 'threadId' : 'id']: id,
        limit: PAGE_SIZE,
        offset
      }
    }
    try {
      const res = await api.getComment(params)
      setList(createCommentList(res.data.comments))
      setHot(res.data.hotComments ? createCommentList(res.data.hotComments) : [])
      setTotal(res.data.total)
      setLoading(false)
    } catch (e) {
      console.log(e)
    }
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
      await api.commentLike({ id, t, type: COMMENT_TYPE_MAP.indexOf(type), cid: comment.commentId })
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

  function onPageChange (currentPage: number) {
    offset = (currentPage - 1) * PAGE_SIZE
    setCurrentPage(currentPage)
    getComment()
  }

  function genCommentNode (title: string, list: CommentCls[]) {
    return (
      <>
        <div styleName="comment-title">{title}</div>
        <div>
          {
            list.map((comment, index) => (
              <div key={comment.commentId + comment.parentCommentId} styleName="comment-item">
                <img styleName="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=100y100'} alt=""/>
                <div styleName={ classnames('comment-item-info', { 'deep': textareaType === 'deep' })}>
                  <div styleName="comment-item-info-text">
                    <span styleName="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}
                  </div>
                  {
                    comment.replied && (
                      <div styleName={ classnames('comment-item-info-replay', { 'deep': textareaType === 'deep' })}>
                        <div styleName="comment-item-info-text replied">
                          {
                            comment.replied.content ?
                            <><span styleName="comment-item-info-name">@{comment.replied.user.nickname}:&nbsp;</span>{comment.replied.content}</>
                            :
                            <div style={{textAlign: 'center'}}>该评论已删除</div>
                          }
                        </div>
                      </div>
                    )
                  }
                  <div styleName="comment-item-info-action">
                    <span styleName="comment-item-info-time">{comment.timeFormat}</span>
                    <span styleName="comment-item-info-like">
                      <Icon
                        name="icon-zan"
                        className={`icon-color-${comment.liked ? 'main' : '6'} hover`}
                        onClick={() => { commentLike(comment) }}
                      >
                      </Icon>
                      { !!comment.likedCount && comment.likedCount}
                    </span>
                    <Icon className="icon-color-6 hover" name="icon-share"></Icon>
                    <Icon className="icon-color-6 hover" onClick={() => { showReplied(`${title}-${index}`) }} name="icon-comment"></Icon>
                  </div>
                  {
                    repliedIndex === `${title}-${index}` && (
                      <>
                        <div styleName={ classnames('comment-textarea-wrap replied', { 'deep': textareaType === 'deep' })}>
                          <textarea
                            value={repliedContent}
                            onChange={(e) => { setRepliedContent(e.target.value) }}
                            styleName="comment-textarea"
                            placeholder={`回复${comment.user.nickname}:`}
                          >
                          </textarea>
                          <span styleName="comment-textarea-reset">140</span>
                        </div>
                        <div styleName="comment-textarea-action">
                          <Icon className="icon-color-6 hover" name="icon-face"></Icon>
                          <Icon className="icon-color-6 hover" name="icon-aite"></Icon>
                          <Icon className="icon-color-6 hover" name="icon-addtag"></Icon>
                          <Button onClick={() => { sendComment(comment.commentId, [{ beRepliedCommentId: comment.commentId, content: comment.content, user: comment.user }]) }}>评论</Button>
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
      { showTitle && <div styleName="comment-count">听友评论<span>(已有{total}条评论)</span></div> }
      <div styleName={ classnames('comment-textarea-wrap', { 'deep': textareaType === 'deep' })}>
        <textarea
          value={content}
          onChange={(e) => { setContent(e.target.value) }}
          styleName="comment-textarea"
          placeholder="输入评论或@朋友"
        >
        </textarea>
        <span styleName="comment-textarea-reset">140</span>
      </div>
      <div styleName="comment-textarea-action">
        <Icon className="icon-color-6 hover" name="icon-face"></Icon>
        <Icon className="icon-color-6 hover" name="icon-aite"></Icon>
        <Icon className="icon-color-6 hover" name="icon-addtag"></Icon>
        <Button onClick={() => { sendComment() }}>评论</Button>
      </div>
      <div>
        <Spin loading={loading} delay={100}>
          {
            list.length ? (
              <>
                {
                  !!hot.length && genCommentNode('精彩评论', hot)
                }
                <div>
                  {genCommentNode('最新评论', list)}
                  {
                    total >= PAGE_SIZE &&
                    <div>
                      <Pagination currentPage={currentPage} total={total} pageSize={PAGE_SIZE} onChange={onPageChange}></Pagination>
                    </div>
                  }
                </div>
              </>
            )
            :
            <div styleName="comment-nodata">还没有评论，快来抢沙发~</div>
          }
        </Spin>
      </div>
    </div>
  )
}

export default Comment