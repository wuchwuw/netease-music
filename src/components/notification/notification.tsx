import React, { useState, useImperativeHandle, forwardRef } from 'react'

interface NotificationProps {

}

const NotificationContainer: React.SFC<NotificationProps> = forwardRef((porps, ref) => {
  const [visiabel, setVisiable] =  useState(false)

  useImperativeHandle(ref, () => ({
    add: (notice) => {
      setVisiable(true)
      setTimeout(() => {
        remove()
      }, notice.duration)
    }
  }))

  function remove () {
    setVisiable(false)
  }

  return (
    <div className="notifiaction-container">
      <div className="notifiaction">
        xxxxxxx
      </div>
    </div>
  )
})

export default NotificationContainer