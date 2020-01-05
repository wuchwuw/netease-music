import React, { useState, useEffect } from "react"
import './message.less'
import classnames from 'classnames'
import api from 'API/index'

const Message: React.SFC = () => {
  const CURRENT_PLAYLIST_PANEL_TAB = {
    message: '私信',
    comment: '评论',
    forward: '@我',
    notice: '通知'
  }
  const [tab, setTab] = useState('comment')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState([])
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
      setLoading(true)
      const res = await api_map[tab]({ limit: 30, uid: 98931610 })
      console.log(res)
    } finally {
      setLoading(false)
    }
  }

  function genMessageNode () {

  }

  function selectTab (tab: string) {
  }
  return (
    <div className="message-container">
      <div className="message-panel-tab ">
        {
          Object.keys(CURRENT_PLAYLIST_PANEL_TAB).map(key => (
            <div onClick={() => selectTab(key)} key={key} className={classnames({ 'active': key === tab })}>
              {CURRENT_PLAYLIST_PANEL_TAB[key]}
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Message