import React from 'react'
import './dialog.less'
import { UseDialogProps } from '.'
import Icon from 'COMPONENTS/icon/icon'

interface DialogProps {
  width?: number
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
        <div styleName="dialog-wrap">
          <div styleName="dialog-content-wrap" style={{ width: `${props.width}px`}}>
            <span styleName="dialog-close" onClick={() => props.close()}><Icon className="icon-color-6 hover" fontSize={20} name="icon-close"></Icon></span>
            <div styleName="dialog-header">
              {props.title}
            </div>
            <div>{props.children}</div>
          </div>
        </div>
      }
    </>
  )
}

export default Dialog