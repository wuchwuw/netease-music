import React, { useState, useImperativeHandle } from 'react'
import './dialog.less'
import { CSSTransition } from 'react-transition-group'

interface DialogProps {
  width: number
  title: string
  children: React.ReactNode
}

const Dialog: React.SFC<DialogProps> = ({
  width = 100,
  title = '',
  children
}, ref) => {
  const [visible, setVisible] = useState(false)

  // useImperativeHandle(ref, () => ({
  //   open: () => {
  //     setVisible(true)
  //   },
  //   close: () => {
  //     setVisible(false)
  //   }
  // }))

  return (
    <CSSTransition in={visible} timeout={500} unmountOnExit classNames="dialog-transition">
      <div className="dialog-wrap">
        <div className="dialog-content-wrap" style={{ width: `${width}px`}}>
          <span className="dialog-close"><i className="iconfont icon-close"></i></span>
          <div className="dialog-header">
            {title}
          </div>
          <div className="dialog-content">{children}</div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Dialog