import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import ReactDOM from 'react-dom'
import './notifaction-container.less'

interface Notifice {
  content: string
  duration: number
  key: string
}

const NotificationContainer: React.ForwardRefExoticComponent<{}> = forwardRef((porps, ref) => {
  const [notices, setNotices] = useState<Notifice[]>([])

  useImperativeHandle(ref, () => ({
    add: (notice: Notifice) => {
      setNotices(prevNotices => {
        const update = prevNotices.concat()
        const index = update.findIndex(n => n.key === notice.key)
        if (index !== -1) {
          update.splice(index, 1, notice)
        } else {
          update.push(notice)
        }
        return update
      })
      setTimeout(() => {
        remove(notice)
      }, notice.duration)
    }
  }))

  function remove (notice: Notifice) {
    setNotices(prevNotices => {
      const update = prevNotices.filter(n => n.key !== notice.key)
      return update
    })
  }

  return (
    <div className="notifaction-container">
      <TransitionGroup>
        {
          notices.map(notice => (
            <CSSTransition key={notice.key} timeout={300} classNames="notification-transition">
              <div className="notifaction-item">{notice.content}</div>
            </CSSTransition>
          ))
        }
      </TransitionGroup>
    </div>
  )
})

export function newInstance (props, callback) {
  const div = document.createElement('div')
  document.body.appendChild(div)

  let called = false
  function ref (notification) {
    console.log(notification)
    if (called) {
      return
    }
    called = true
    callback({
      notice: (noticeProps) => {
        notification.add(noticeProps);
      }
    })
  }
  
  ReactDOM.render(<NotificationContainer ref={ref} {...props}></NotificationContainer>, div)
}