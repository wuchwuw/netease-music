import React, { useState } from 'react'
import './dialog.less'
import { CSSTransition } from 'react-transition-group'
import { UseDialogProps } from '.'

export function useDialog () {
  const [visible, setVisible] = useState(false)
  const show = () => setVisible(true)
  const hide = () => setVisible(false)
  const toggle = () => setVisible(!visible)

  return {
    visible,
    show,
    hide,
    toggle
  }
}

interface DialogProps {
  width: number
  title?: string
  children: React.ReactNode
}

const Dialog: React.SFC<DialogProps & UseDialogProps> = (props) => {
  return (
    <CSSTransition in={props.visible} timeout={300} unmountOnExit classNames="fade">
      <div className="dialog-wrap">
        <div className="dialog-content-wrap" style={{ width: `${props.width}px`}}>
          <span className="dialog-close" onClick={() => props.close()}><i className="iconfont icon-close"></i></span>
          <div className="dialog-header">
            {props.title}
          </div>
          <div className="dialog-content">{props.children}</div>
        </div>
      </div>
    </CSSTransition>
  )
}

export default Dialog