import React, { useState, useEffect } from 'react'
import './message.less'
import classnames from 'classnames'
import api from 'API/index'
import Spin from 'COMPONENTS/spin/spin'
import dayjs from 'dayjs'
import { useChat } from 'UTIL/chat-controller'
import { RootState } from 'STORE/index'
import { useSelector } from 'react-redux'
import User from 'UTIL/user'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { createForwardList, ForwardSourceType, ForwardSourceContentType, ForwardType, ForwardClassType, ForwardComment, ForwardEvent } from 'UTIL/forword'
import { MessageSourcePlaylist, MessageSourceAlbum, MessageSourceSong, MessageSourceVideo, MessageSourceMV } from 'COMPONENTS/commen/message-source'
import { ActivityClassType, ActivityType } from 'UTIL/activity'

interface Message {
  fromUser: User
  lastMsgTime: number
  lastMsg: string
}

interface Comment {
  user: User
  beRepliedContent: string
  content: string
  lastMsgTime: number
}

interface Notice {
  msg: string
  content: string
  user: User
  time: string
}

function getMessageLast (last: string) {
  const lastMsg = JSON.parse(last)
  return lastMsg.msg
}

function getNotice (noticeData: any): Notice {
  const notice = JSON.parse(noticeData.notice)
  let msg = ''
  let content = ''

  if (notice.playlist) {
    msg = '收藏了你的歌单'
    content = `「${notice.playlist.name}」`
  }
  if (notice.comment) {
    msg = '赞了你的评论'
    content = notice.comment.content
  }
  return {
    msg,
    content,
    user: notice.user,
    time: dayjs(noticeData.time).format('YYYY年MM月DD日')
  }
}

enum TabType {
  MESSAGE = 'message',
  COMMENT = 'comment',
  FORWARD = 'forward',
  NOTICE = 'notice'
}

const CURRENT_PLAYLIST_PANEL_TAB = {
  message: '私信',
  comment: '评论',
  forward: '@我',
  notice: '通知'
}

let offset = 0
let limit = 30
let lasttime = -1
let before = -1
let hasmore = true
let moreLoading = false

const Message: React.SFC = () => {

  const { setCurrentChat } = useChat()
  const [tab, setTab] = useState(TabType.MESSAGE)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<Message[]>([])
  const [comment, setComment] = useState<Comment[]>([])
  const [forwords, setForwords] = useState<ForwardClassType[]>([])
  const [notice, setNotice] = useState([])
  const user = useSelector((state: RootState) => state.user.user)

  useEffect(() => {
    getData(false)
    return () => {
      offset = 0
      lasttime = -1
      before = -1
      hasmore = true
      moreLoading = false
    }
  }, [tab])

  function getApi () {
    const api_map = {
      message: () => api.getPanelMessage({ offset, limit }),
      comment: () => api.getPanelComments({ uid: user.userId, limit, before }),
      forward: () => api.getPanelForwards({ offset, limit }),
      notice: () => api.getPanelNotices({ lasttime, limit })
    }
    return api_map[tab]
  }

  async function getData (loadmore: boolean) {
    try {
      moreLoading = true
      const res = await getApi()()
      switch (tab) {
        case TabType.MESSAGE:
          setMessage(loadmore ? message => message.concat(res.data.msgs) : res.data.msgs)
          break
        case TabType.COMMENT:
          const commentLen = res.data.comments.length
          commentLen && (before = res.data.comments[commentLen - 1].time)
          setComment(loadmore ? comment => comment.concat(res.data.comments) : res.data.comments)
          break
        case TabType.FORWARD:
          setForwords(loadmore ? forward => forward.concat(createForwardList(res.data.forwards)) : createForwardList(res.data.forwards))
          break
        case TabType.NOTICE:
          const noticeLen = res.data.notices.length
          noticeLen && (lasttime = res.data.notices[noticeLen - 1].time)
          setNotice(loadmore ? notice => notice.concat(res.data.notices) : res.data.notices)
          break
      }
      hasmore = res.data.more
      moreLoading = false
    } finally {
      setLoading(false)
    }
  }

  function genNode () {
    switch (tab) {
      case TabType.MESSAGE:
        return genMessageNode()
      case TabType.COMMENT:
        return genCommentNode()
      case TabType.FORWARD:
        return genForwardNode()
      case TabType.NOTICE:
        return genNoticeNode()
    }
  }

  function selectTab (tab: TabType) {
    setLoading(true)
    setTab(tab)
  }

  function load () {
    console.log(111)
    if (moreLoading) return
    if (!hasmore) return
    offset = offset + limit
    getData(true)
  }

  function genCommentNode () {
    return (
      <ul styleName="panel-comment-list">
        {
          comment.map((item, index) => (
            <li key={index} styleName="panel-comment-item">
              <img styleName="panel-comment-avatar" src={item.user.avatarUrl} alt=""/>
              <div styleName="panel-message-info">
                <div styleName="panel-message-name">
                  <span>{item.user.nickname}</span>
                  <span>{dayjs(item.lastMsgTime).format('YYYY年MM月DD日')}</span>
                </div>
                <div styleName="panel-comment-replay">回复我: {item.content}</div>
                <div styleName="panel-comment-msg">{item.beRepliedContent}</div>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  function genMessageNode () {
    return (
      <ul>
        {
          message.map((item, index) => (
            <li onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setCurrentChat(item.fromUser) }} key={index} styleName="panel-message-item" >
              <img styleName="panel-message-avatar" src={item.fromUser.avatarUrl + '?param=100y100'} alt=""/>
              <div styleName="panel-message-info">
                <div styleName="panel-message-name">
                  <span className="commen-link-blue">{item.fromUser.nickname}</span>
                  <span>{dayjs(item.lastMsgTime).format('YYYY年MM月DD日')}</span>
                </div>
                <div styleName="panel-message-msg">{getMessageLast(item.lastMsg)}</div>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  function genNoticeNode () {
    return (
      <ul className="panel-message-list">
        {
          notice.map((item, index) => {
            const notice = getNotice(item)
            return (
              <li key={index} styleName="panel-message-item">
                <img styleName="panel-message-avatar" src={notice.user.avatarUrl + '?param=100y100'} alt=""/>
                <div styleName="panel-message-info">
                  <div styleName="panel-message-name">
                    <span className="text-overflow"><span className="commen-link-blue">{notice.user.nickname}</span>{notice.msg}</span>
                    <span>{notice.time}</span>
                  </div>
                  <div styleName="panel-message-msg">{notice.content}</div>
                </div>
              </li>
            )
          })
        }
      </ul>
    )
  }

  function genForwardNode () {
    return (
      <ul>
        {
          forwords.map(forword => {
            if (forword.type === ForwardType.COMMENT) {
              return genForwardCommentNode(forword)
            } else if (forword.type === ForwardType.EVENT) {
              return genForwardEventNode(forword)
            }
          })
        }
      </ul>
    )
  }

  function genForwardCommentNode (forward: ForwardComment) {
    return (
      <li styleName="message-forward-item">
        <img styleName="forward-avatar" src={forward.comment.user.avatarUrl + '?param=100y100'} alt=""/>
        <div styleName="forward-info-wrap">
          <div styleName="forward-info">
            <div styleName="forward-info-name" className="commen-link-blue">{forward.comment.user.nickname}</div>
            <div styleName="forward-info-time">{forward.timeFormat}</div>
          </div>
          <div styleName="forward-text">{forward.comment.content}</div>
          <div styleName="forward-resource">
            {genForwardResource(forward.resource)}
          </div>
        </div>
      </li>
    )
  }

  function genForwardResource (resource: ForwardSourceContentType | ActivityClassType) {
    switch (resource.type) {
      case ForwardSourceType.PLAYLIST:
      case ActivityType.PLAYLIST:
        return <MessageSourcePlaylist playlist={resource.content}></MessageSourcePlaylist>
      case ForwardSourceType.ALBUM:
      case ActivityType.Album:
        return <MessageSourceAlbum album={resource.content}></MessageSourceAlbum>
      case ForwardSourceType.SONG:
      case ActivityType.Song:
        return <MessageSourceSong song={resource.content}></MessageSourceSong>
      case ForwardSourceType.VIDEO:
      case ActivityType.Video:
        return <MessageSourceVideo video={resource.content}></MessageSourceVideo>
      case ForwardSourceType.MV:
      case ActivityType.MV:
        return <MessageSourceMV mv={resource.content}></MessageSourceMV>
      case ActivityType.Forword:
        return (
          <div styleName="forward-activity-forward">
            <div styleName="forward-activity-forward-text"><span>{'@' + resource.content.user.nickname}</span>{resource.content.activityText + ': ' + resource.content.message}</div>
            <div styleName="forward-activity-forward-content">{genForwardResource(resource.content)}</div>
          </div>
        )
    }
  }

  function genForwardEventNode (forward: ForwardEvent) {
    return (
      <li styleName="message-forward-item">
        <img styleName="forward-avatar" src={forward.event.user.avatarUrl + '?param=100y100'} alt=""/>
        <div styleName="forward-info-wrap">
          <div styleName="forward-info">
            <div styleName="forward-info-name" className="commen-link-blue">{forward.event.user.nickname}</div>
            <div styleName="forward-info-time">{forward.timeFormat}</div>
          </div>
          <div styleName="forward-text">{forward.event.message}</div>
          <div styleName="forward-resource">
            {genForwardResource(forward.event)}
          </div>
        </div>
      </li>
    )
  }

  return (
    <div styleName="message-panel-container">
      <div styleName="message-panel-tab ">
        {
          (Object.keys(CURRENT_PLAYLIST_PANEL_TAB) as Array<TabType>).map(key => (
            <div onClick={() => selectTab(key)} key={key} styleName={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
        <LoadMore load={load} el="#message-panel-content">
           <div id="message-panel-content" styleName="message-panel-content">
            <Spin loading={loading} delay={0}>
              {
                !loading && genNode()
              }
            </Spin>
          </div>
        </LoadMore>
    </div>
  )
}

export default Message