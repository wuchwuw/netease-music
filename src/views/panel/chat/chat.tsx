import React, { useState, useEffect } from 'react'
import './chat.less'
import api from 'API/index'
import { Chat as ChatClass, createChatList, ChatContentType} from 'UTIL/chat'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import classnames from 'classnames'
import { useChat } from 'UTIL/chat-controller'
import { usePanelContaienr, PanelType } from '../container'

let hasMore = false
let loading = false

const Chat = () => {
  const [content, setContent] = useState('')
  const [chatList, setChatList] = useState<ChatClass[]>([])
  const user = useSelector((state: RootState) => state.user.user)
  const { currentChat } = useChat()
  const { setPanelType } = usePanelContaienr()

  useEffect(() => {
    getPrivateMessage()
  }, [])

  useEffect(() => {
    const remove = initScroll()
    return remove
  })

  async function getPrivateMessage (before?: number) {
    try {
      loading = true
      let params = { uid: currentChat.userId, limit: 10 }
      before && (params.before = before)
      const res = await api.getPrivateMessage(params)
      setChatList(list => {
        return (createChatList(res.data.msgs).reverse()).concat(list)
      })
      hasMore = res.data.more
      loading = false
      !before && initScrollTop()
    } catch (e) {
      console.log(e)
    }
  }

  function initScrollTop () {
    let content = document.querySelector('.chat-panel-content')
    const height = content!.clientHeight
    const scrollHeight = content!.scrollHeight
    content!.scrollTop = scrollHeight - height
  }

  function isMe (chat: ChatClass) {
    return chat.fromUser.userId === user.userId
  }

  async function sendMessage () {
    try {
      const res = await api.sendTextMessage({ user_ids: [currentChat.userId], msg: content })
      if (res.data.newMsgs.length) {
        const newMsg = res.data.newMsgs[0]
        chatList.push(new ChatClass(newMsg))
        setChatList([...chatList])
      }
    } catch (e) {}
  }

  function initScroll () {
    const content = document.querySelector('.chat-panel-content')
    function scroll () {
      if (content!.scrollTop < 100) {
        loadMore()
      }
    }
    content!.addEventListener('scroll', scroll)
    return () => { content!.removeEventListener('scroll', scroll) }
  }

  function loadMore () {
    if (!hasMore) return
    if (loading) return
    getPrivateMessage(chatList[0].time)
  }

  function getContent (chat: ChatClass) {
    const content = chat.content
    switch (content.type) {
      case ChatContentType.PLAYLIST:
        return (
          <div className="chat-content-playlist">
            <img className="chat-content-playlist-cover" src={content.content.coverImgUrl + '?param=100y100'} alt=""/>
            <div  className="chat-content-playlist-info">
              <div className="chat-content-playlist-info-name"><span>歌单</span>{content.content.name}</div>
              <div className="chat-content-playlist-info-user">by {content.content.creator.nickname}</div>
            </div>
          </div>
        )
      case ChatContentType.ALBUM:
        return (
          <div className="chat-content-playlist">
            <img className="chat-content-playlist-cover" src={content.content.picUrl + '?param=100y100'} alt=""/>
            <div  className="chat-content-playlist-info">
              <div className="chat-content-playlist-info-name"><span>专辑</span>{content.content.name}</div>
              <div className="chat-content-playlist-info-user">by {content.content.artistName}</div>
            </div>
          </div>
        )
      case ChatContentType.MV:
        return (
          <div className="chat-content-mv">
            <img className="chat-content-mv-cover" src={content.content.cover + '?param=400y225'} alt=""/>
            <div className="chat-content-mv-name">{content.content.name}</div>
            <div className="chat-contnet-mv-info">
              <span>播放{content.content.playCount_format}</span>
              <span>{content.content.duration_format}</span>
            </div>
          </div>
        )
      case ChatContentType.PROMOTION:
        return (
          <div className="chat-content-promotion" onClick={() => { window.open(content.content.url) }}>
            <img className="chat-content-promotion-cover" src={content.content.coverUrl + '?param=120y80'} alt=""/>
            <div>{content.content.title}</div>
          </div>
        )
      case ChatContentType.GENERAL:
        return (
          <div className="chat-content-promotion" onClick={() => { window.open(content.content.webUrl) }}>
            <img className="chat-content-general-cover" src={content.content.cover + '?param=100y100'} alt=""/>
            <div>{content.content.title}</div>
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
        <i onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setPanelType(PanelType.Message) }} className="iconfont icon-arrow-left chat-panel-icon-arrow"></i>
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
                  { chat.content.content && <div className="chat-panel-item-content-other">{getContent(chat)}</div> }
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div className="chat-panel-textarea">
        <div className="comment-textarea-wrap">
          <textarea value={content} onChange={(e) => { setContent(e.target.value) }} className="comment-textarea" placeholder={`回复${currentChat.nickname}：`}></textarea>
          <span className="comment-textarea-reset">140</span>
        </div>
        <div className="comment-textarea-action">
          <i className="iconfont icon-face"></i>
          <i className="iconfont icon-aite"></i>
          <i className="iconfont icon-addtag"></i>
          <span onClick={() => { sendMessage() }} className="comment-textarea-action-btn">评论</span>
        </div>
      </div>
    </div>
  )
}

export default Chat