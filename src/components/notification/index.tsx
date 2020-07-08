import React, { ReactNode } from 'react'
import ReactDOM from 'react-dom'
import NotificationContainer from 'COMPONENTS/notification/notification'
import Icon from 'COMPONENTS/icon/icon'

let instance: any = null
const DEFAULT_DURATOIN = 1500

interface NotificationContent {
  content: string | ReactNode
  duration?: number
}

interface NotificationApi {
  open: (content: NotificationContent) => void
  success: (content: NotificationContent) => void
  error: (content: NotificationContent) => void
  info: (content: NotificationContent) => void
}

type NotificationType = 'success' | 'error' | 'info'

function getInstance (callback: (i: any) => void) {
  if (instance) {
    callback(instance)
  } else {
    function ref (i: any) {
      if (i) {
        instance = i
        callback(i)
      }
    }
    const container = document.createElement('div')
    document.body.appendChild(container)
    ReactDOM.render(<NotificationContainer ref={ref}></NotificationContainer>, container)
  }
}

function notice (args: NotificationContent) {
  getInstance(instance => {
    instance.open(args)
  })
}

const notificationApi: any = {
  open: notice
}

const notificationType = ['success', 'error', 'info']

notificationType.forEach((type) => {
  function getContent (content: string | ReactNode) {
    switch (type) {
      case 'success':
        return (
          <><Icon name="icon-gou" className="notification-icon"></Icon>{content}</>
        )
      case 'error':
        return (
          <><Icon name="icon-close" className="notification-icon"></Icon>{content}</>
        )
      default:
        return content
    }
  }

  notificationApi[type] = (args: NotificationContent) => {
    notificationApi.open({
      content: getContent(args.content),
      duration: args.duration || DEFAULT_DURATOIN
    })
  }
})

export default notificationApi