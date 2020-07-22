import React, { useState, useImperativeHandle, forwardRef, ReactNode } from 'react'
import './notification.less'
import { CSSTransition } from 'react-transition-group'

interface NotificationContent {
  content: string | ReactNode
  duration: number
}

let timer: NodeJS.Timeout | null = null

const NotificationContainer = forwardRef((porps, ref) => {
  const [visible, setVisiable] = useState(false)
  const [contnet, setContent] = useState<string | ReactNode>('')

  useImperativeHandle(ref, () => ({
    open: (content: NotificationContent) => {
      if (timer) clearTimeout(timer)
      setContent(content.content)
      setVisiable(true)
      timer = setTimeout(() => {
        remove()
      }, content.duration)
    }
  }), [])

  function remove () {
    setVisiable(false)
  }

  return (
    <div styleName="notifiaction-container">
      <CSSTransition in={visible} unmountOnExit timeout={300} classNames="notification-transition">
        <div styleName="notifiaction">
          {contnet}
        </div>
      </CSSTransition>
    </div>
  )
})

export default NotificationContainer