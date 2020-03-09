import React, { useState, useEffect } from 'react'
import './comment.less'
import api from 'API/index'
import Pagination from 'COMPONENTS/pagination/pagination'
import Spin from 'COMPONENTS/spin/spin'
import CommentCls, { createCommentList } from 'UTIL/comment'

interface CommentProps {
  id: number | string
  type: string
}
const COMMENT_TYPE_MAP = ['music', 'mv', 'playlist', 'album', 'dj', 'video']

const Comment: React.SFC<CommentProps> = (props) => {
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [list, setList] = useState<CommentCls[]>([])
  const [hot, setHot] = useState<CommentCls[]>([])
  const PAGE_SIZE = 60

  useEffect(() => {
    if (!props.id) return
    getComment()
  }, [props.id])

  async function getComment () {
    setLoading(true)
    const params = {
      type: props.type,
      params: {
        id: props.id,
        limit: PAGE_SIZE
      }
    }
    try {
      const res = await api.getComment(params)
      setList(createCommentList(res.data.comments))
      setHot(createCommentList(res.data.hotComments))
      setTotal(res.data.total)
      setLoading(false)
    } catch (e) { console.log(e) }
  }

  function genCommentNode (title: string, list: CommentCls[]) {
    return (
      <>
        <div className="comment-title">{title}</div>
        <div className="comment-list">
          {
            list.map(comment => (
              <div key={comment.commentId + comment.parentCommentId} className="comment-item">
                <img className="comment-item-user-avatar" src={comment.user.avatarUrl+'?param=35y35'} alt=""/>
                <div className="comment-item-info">
                  <div className="comment-item-info-text">
                    <span className="comment-item-info-name">{comment.user.nickname}:&nbsp;</span>{comment.content}
                  </div>
                  {
                    !!comment.replied && (
                      <div className="comment-item-info-replay">
                        <div className="comment-item-info-text">
                          <span className="comment-item-info-name">@{comment.replied.user.nickname}:&nbsp;</span>{comment.replied.content}
                        </div>
                      </div>
                    )
                  }
                  <div className="comment-item-info-action">
                    <span className="comment-item-info-time">{comment.timeFormat}</span>
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
      </>
    )
  }

  return (
    <div>
      <div className="comment-textarea-wrap">
        <textarea className="comment-textarea" placeholder="输入评论或@朋友"></textarea>
        <span className="comment-textarea-reset">140</span>
      </div>
      <div className="comment-textarea-action">
        <i className="iconfont icon-face"></i>
        <i className="iconfont icon-aite"></i>
        <i className="iconfont icon-addtag"></i>
        <span className="comment-textarea-action-btn">评论</span>
      </div>
      <div className="comment-content">
        <Spin loading={loading} delay={300}>
          {
            (list.length) ? (
              <>
                <div className="comment-hot">
                  {genCommentNode('精彩评论', hot)}
                </div>
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