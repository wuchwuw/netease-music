import React, { useState } from 'react'
import './dialog.less'

interface DialogProps {
  width: number
  title: string
  children: React.ReactNode
}

const Dialog: React.SFC<DialogProps> = ({
  width = 100,
  title = '',
  children
}) => {
  const [visible, setVisible] = useState(false)


  return (
    <div className="dialog-wrap">
      <div className="dialog-content-wrap" style={{ width: `${width}px`}}>
        <span className="dialog-close"><i className="iconfont icon-close"></i></span>
        <div className="dialog-header">
          {title}
        </div>
        <div className="dialog-content">{children}</div>
      </div>
    </div>
  )
}

export default Dialog