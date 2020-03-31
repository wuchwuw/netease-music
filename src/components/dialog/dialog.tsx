import React, { useState } from 'react'
import './dialog.less'
import { CSSTransition } from 'react-transition-group'
import { UseDialogProps } from '.'

interface DialogProps {
  width: number
  title?: string
  children: React.ReactNode
}

const Dialog: React.SFC<DialogProps & UseDialogProps> = (props) => {
  return (
    // <CSSTransition in={props.visible} timeout={300} unmountOnExit classNames="fade">
    //   <div className="dialog-wrap">
    //     <div className="dialog-content-wrap" style={{ width: `${props.width}px`}}>
    //       <span className="dialog-close" onClick={() => props.close()}><i className="iconfont icon-close"></i></span>
    //       <div className="dialog-header">
    //         {props.title}
    //       </div>
    //       <div className="dialog-content">{props.children}</div>
    //     </div>
    //   </div>
    // </CSSTransition>
    <>
      {
        props.visible &&
        <div className="dialog-wrap">
          <div className="dialog-content-wrap" style={{ width: `${props.width}px`}}>
            <span className="dialog-close" onClick={() => props.close()}><i className="iconfont icon-close"></i></span>
            <div className="dialog-header">
              {props.title}
            </div>
            <div className="dialog-content">{props.children}</div>
          </div>
        </div>
      }
    </>
  )
}

export default Dialog