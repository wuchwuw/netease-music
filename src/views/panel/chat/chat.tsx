import React, { useState, useEffect } from 'react'
import './chat.less'
import api from 'API/index'
import { Chat as ChatClass, createChatList, ChatContentType} from 'UTIL/chat'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import classnames from 'classnames'
import { useChat } from 'UTIL/chat-controller'
import { usePanelContaienr, PanelType } from '../container'

const Chat = () => {
  const [content, setContent] = useState('')
  const [chatList, setChatList] = useState<ChatClass[]>([])
  const user = useSelector((state: RootState) => state.user.user)
  const { currentChat } = useChat()
  const { setPanelType } = usePanelContaienr()

  useEffect(() => {
    getPrivateMessage()
  }, [])

  async function getPrivateMessage () {
    try {
      const res = await api.getPrivateMessage({ uid: currentChat.userId, limit: 10})
      setChatList(createChatList(res.data.msgs))
    } catch (e) {
      console.log(e)
    }
  }

  function isMe (chat: ChatClass) {
    return chat.fromUser.userId === user.userId
  }

  function getContent (chat: ChatClass) {
    const content = chat.content
    switch (content.type) {
      case ChatContentType.PLAYLIST:
        return (
          <div className="chat-content-playlist">
            <img className="chat-content-playlist-cover" src={content.content.coverImgUrl} alt=""/>
            <div  className="chat-content-playlist-info">
              <div className="chat-content-playlist-info-name"><span>歌单</span>{content.content.name}</div>
              <div className="chat-content-playlist-info-user">by {content.content.creator.nickname}</div>
            </div>
          </div>
        )
      case ChatContentType.ALBUM:
        return (
          <div className="chat-content-playlist">
            <img className="chat-content-playlist-cover" src={content.content.picUrl} alt=""/>
            <div  className="chat-content-playlist-info">
              <div className="chat-content-playlist-info-name"><span>专辑</span>{content.content.name}</div>
              <div className="chat-content-playlist-info-user">by {content.content.artistName}</div>
            </div>
          </div>
        )
        case ChatContentType.MV:
          return (
            <div className="chat-content-MV">
              <img className="chat-content-MV-cover" src={content.content.cover} alt=""/>
              <div className="chat-content-MV-name">{content.content.name}</div>
              <div className="chat-contnet-MV-info">
                <span>播放{content.content.playCount_format}</span>
                <span>{content.content.duration_format}</span>
              </div>
            </div>
          )
      case ChatContentType.TEXT:
      default:
        return null
    }
  }

  return (
    <div className="chat-panel-container">
      <div className="chat-panel-title">
        <i onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setPanelType(PanelType.Message) }} className="iconfont icon-arrow chat-panel-icon-arrow"></i>
        <span>{currentChat.nickname}</span>
      </div>
      <div className="chat-panel-content">
        {
          chatList.map(chat => (
            <div key={chat.id} className={classnames('chat-panel-item', { 'me': isMe(chat) })}>
              <div className="chat-panel-item-wrap">
                { !isMe(chat) && <img className="chat-panel-item-user-avatar" src={chat.fromUser.avatarUrl} alt=""/>}
                <div className="chat-panel-item-content">
                  <div className="chat-panel-item-content-mesage">{chat.msg}</div>
                    <div className="chat-panel-item-content-other">{getContent(chat)}</div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="chat-panel-textarea">
        <div className="comment-textarea-wrap">
          <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className="comment-textarea" placeholder="回复司南难楠楠"></textarea>
          <span className="comment-textarea-reset">140</span>
        </div>
        <div className="comment-textarea-action">
          <i className="iconfont icon-face"></i>
          <i className="iconfont icon-aite"></i>
          <i className="iconfont icon-addtag"></i>
          <span onClick={() => { }} className="comment-textarea-action-btn">评论</span>
        </div>
      </div>
    </div>
  )
}

export default Chat