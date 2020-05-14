import React, { useState, useEffect } from 'react'
import './chat.less'
import api from 'API/index'

const Chat = () => {
  const [content, setContent] = useState('')

  useEffect(() => {
    getPrivateMessage()
  }, [])

  async function getPrivateMessage () {
    try {
      api.getPrivateMessage({ uid: 9003, limit: 10})
    } catch (e) {}
  }

  return (
    <div className="chat-panel-container">
      <div className="chat-panel-title">
        <i className="iconfont icon-arrow"></i>
        <span>司南难楠楠</span>
      </div>
      <div className="chat-panel-content"></div>
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