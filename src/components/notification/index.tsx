import React from 'react'
import ReactDOM from 'react-dom'
import NotificationContainer from 'COMPONENTS/notification/notification'

let instance = null

function getInstance (callback: () => void) {
  if (instance) {
    callback(instance)
  } else {
    function ref (i) {
      callback(i)
    }
    const container = document.createElement('div')
    ReactDOM.render(<NotificationContainer ref={ref}></NotificationContainer>, container)
  }
}

const notificationType = ['success', 'error', 'info']

const notificationApi = {
  open: () => {

  }
}