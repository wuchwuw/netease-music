import React, { useState, useEffect, useRef } from 'react'
import './chat.less'
import api from 'API/index'
import { Chat as ChatClass, createChatList, ChatContentType} from 'UTIL/chat'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import classnames from 'classnames'
import { useChat } from 'UTIL/chat-controller'
import { usePanelContaienr, PanelType } from '../container'
import Icon from 'COMPONENTS/icon/icon'
import Button from 'COMPONENTS/button/button'
import { useUpdateEffect } from 'UTIL/hooks'
import { MessageSourcePlaylist, MessageSourceAlbum, MessageSourceVideo, MessageSourceMV } from 'COMPONENTS/commen/message-source'
import { usePageForword } from 'ROUTER/hooks'

let hasMore = false
let loading = false

const Chat = () => {
  const [content, setContent] = useState('')
  const [chatList, setChatList] = useState<ChatClass[]>([])
  const user = useSelector((state: RootState) => state.user.user)
  const { currentChat } = useChat()
  const { setPanelType } = usePanelContaienr()
  const contentScrollHeight = useRef(0)
  const { goPlaylistDetail, goAlbumDetail, goMVDetail, goVideoDetail } = usePageForword()

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
      let params = { uid: currentChat.userId, limit: 10, before }
      const res = await api.getPrivateMessage(params)
      setChatList(list => {
        return (createChatList(res.data.msgs).reverse()).concat(list)
      })
      hasMore = res.data.more
      loading = false
    } catch (e) {
      console.log(e)
    }
  }

  useUpdateEffect(() => {
    const content = document.querySelector('#chat-panel-content')
    const height = content!.clientHeight
    const scrollHeight = content!.scrollHeight
    if (contentScrollHeight.current === 0) {
      content!.scrollTop = scrollHeight - height
    } else {
      content!.scrollTop = scrollHeight - contentScrollHeight.current
    }
    contentScrollHeight.current = scrollHeight
  }, [chatList.length])

  function initScrollTop () {
    let content = document.querySelector('#chat-panel-content')
    const height = content!.clientHeight
    const scrollHeight = content!.scrollHeight
    content!.scrollTop = scrollHeight - height
    contentScrollHeight.current = scrollHeight
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
    const content = document.querySelector('#chat-panel-content')
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
        return <MessageSourcePlaylist onClick={() => goPlaylistDetail(content.content.id)} playlist={content.content}></MessageSourcePlaylist>
      case ChatContentType.ALBUM:
        return <MessageSourceAlbum onClick={() => goAlbumDetail(content.content.id)} album={content.content}></MessageSourceAlbum>
      case ChatContentType.VIDEO:
        return <MessageSourceVideo onClick={() => goVideoDetail(content.content.vid)} video={content.content}></MessageSourceVideo>
      case ChatContentType.MV:
        return <MessageSourceMV onClick={() => goMVDetail(content.content.id)} mv={content.content}></MessageSourceMV>
      case ChatContentType.PROMOTION:
        return (
          <div styleName="chat-content-promotion" onClick={() => { window.open(content.content.url) }}>
            <img styleName="chat-content-promotion-cover" src={content.content.coverUrl + '?param=120y80'} alt=""/>
            <div>{content.content.title}</div>
          </div>
        )
      case ChatContentType.GENERAL:
        return (
          <div styleName="chat-content-promotion" onClick={() => { window.open(content.content.webUrl) }}>
            <img styleName="chat-content-general-cover" src={content.content.cover + '?param=100y100'} alt=""/>
            <div>{content.content.title}</div>
          </div>
        )
      case ChatContentType.TEXT:
      default:
        return null
    }
  }

  return (
    <div styleName="chat-panel-container">
      <div styleName="chat-panel-title">
        <Icon onClick={(e) => { e.nativeEvent.stopImmediatePropagation(); setPanelType(PanelType.Message) }} name="icon-arrow-right"></Icon>
        <span>{currentChat.nickname}</span>
      </div>
      <div id="chat-panel-content" styleName="chat-panel-content">
        {
          chatList.map(chat => (
            <div key={chat.id} styleName={classnames('chat-panel-item', { 'me': isMe(chat) })}>
              <div styleName="chat-panel-item-wrap">
                { !isMe(chat) && <img styleName="chat-panel-item-user-avatar" src={chat.fromUser.avatarUrl + '?param=100y100'} alt=""/>}
                <div styleName="chat-panel-item-content">
                  <div styleName="chat-panel-item-content-mesage">{chat.msg}</div>
                  { chat.content.content && <div styleName="chat-panel-item-content-other">{getContent(chat)}</div> }
                </div>
              </div>
            </div>
          ))
        }
      </div>
      <div styleName="chat-panel-textarea">
        <div styleName="comment-textarea-wrap">
          <textarea value={content} onChange={(e) => { setContent(e.target.value) }} styleName="comment-textarea" placeholder={`回复${currentChat.nickname}：`}></textarea>
          <span styleName="comment-textarea-reset">140</span>
        </div>
        <div styleName="comment-textarea-action">
          <Icon name="icon-face"></Icon>
          <Icon name="icon-aite"></Icon>
          <Icon name="icon-addtag"></Icon>
          <Button onClick={() => { sendMessage() }}>评论</Button>
        </div>
      </div>
    </div>
  )
}

export default Chat