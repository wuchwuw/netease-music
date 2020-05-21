import React, { useState, useEffect } from "react"
import './message.less'
import classnames from 'classnames'
import api from 'API/index'
import Spin from 'COMPONENTS/spin/spin'
import dayjs from 'dayjs'
import { useChat } from "UTIL/chat-controller"

function getMessageLast (last: string) {
  const lastMsg = JSON.parse(last)
  return lastMsg.msg
}

function getNotice (noticeData) {
  const notice = JSON.parse(noticeData.notice)
  let msg
  let content

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

const Message: React.SFC = () => {

  const { setCurrentChat } = useChat()

  const CURRENT_PLAYLIST_PANEL_TAB = {
    message: '私信',
    comment: '评论',
    forward: '@我',
    notice: '通知'
  }
  const [tab, setTab] = useState('message')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState([])
  const [comment, setComment] = useState([])
  const [notice, setNotice] = useState([])

  const api_map = {
    message: api.getPanelMessage,
    comment: api.getPanelComments,
    forward: api.getPanelForwards,
    notice: api.getPanelNotices
  }

  useEffect(() => {
    getData()
  }, [tab])

  async function getData () {
    try {
      const res = await api_map[tab]({ limit: 30, uid: 98931610 })
      switch (tab) {
        case 'message':
          setMessage(res.data.msgs)
          break
        case 'comment':
          setComment(res.data.comments)
          break
        case 'forward':
          break
        case 'notice':
          setNotice(res.data.notices)
      }
    } finally {
      setLoading(false)
    }
  }

  function genNode () {
    switch (tab) {
      case 'message':
        return genMessageNode()
      case 'comment':
        return genCommentNode()
      case 'forward':
        break
      case 'notice':
        return genNoticeNode()
    }
  }

  function selectTab (tab: string) {
    setLoading(true)
    setTab(tab)
  }

  function genCommentNode () {
    return (
      <ul className="panel-comment-list">
        {
          comment.map((item, index) => (
            <li key={index} className="panel-comment-item">
              <img className="panel-comment-avatar" src={item.user.avatarUrl} alt=""/>
              <div className="panel-message-info">
                <div className="panel-message-name">
                  <span>{item.user.nickname}</span>
                  <span>{dayjs(item.lastMsgTime).format('YYYY年MM月DD日')}</span>
                </div>
                <div className="panel-comment-replay">回复我: {item.content}</div>
                <div className="panel-comment-msg">{item.beRepliedContent}</div>
              </div>
            </li>
          ))
        }
      </ul>
    )
  }

  function genMessageNode () {
    return (
      <ul className="panel-message-list">
        {
          message.map((item, index) => (
            <li onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setCurrentChat(item.fromUser) }} key={index} className="panel-message-item" >
              <img className="panel-message-avatar" src={item.fromUser.avatarUrl + '?param=100y100'} alt=""/>
              <div className="panel-message-info">
                <div className="panel-message-name">
                  <span className="commen-link-blue">{item.fromUser.nickname}</span>
                  <span>{dayjs(item.lastMsgTime).format('YYYY年MM月DD日')}</span>
                </div>
                <div className="panel-message-msg">{getMessageLast(item.lastMsg)}</div>
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
              <li key={index} className="panel-message-item">
                <img className="panel-message-avatar" src={notice.user.avatarUrl} alt=""/>
                <div className="panel-message-info">
                  <div className="panel-message-name">
                    <span>{notice.user.nickname}{notice.msg}</span>
                    <span>{notice.time}</span>
                  </div>
                  <div className="panel-message-msg">{notice.content}</div>
                </div>
              </li>
            )
          })
        }
      </ul>
    )
  }

  return (
    <div className="message-panel-container">
      <div className="message-panel-tab ">
        {
          Object.keys(CURRENT_PLAYLIST_PANEL_TAB).map(key => (
            <div onClick={() => selectTab(key)} key={key} className={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
      <div className="message-panel-content">
        <Spin loading={loading} delay={300}>
          {
            genNode()
          }
        </Spin>
      </div>
    </div>
  )
}

export default Message