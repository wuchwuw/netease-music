import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import { UseDialogProps } from '..'
import './confirm.less'

export interface ConfirmProps {
  confirm: (callback?: () => void) => void
  text: string
  buttonText: string
}

const Confirm: React.SFC<ConfirmProps & UseDialogProps> = ({
  visible,
  open,
  close,
  toggle,
  confirm,
  text,
  buttonText
}) => {
  return (
    <Dialog width={400} {...{visible, open, close, toggle}}>
      <div styleName="confirm-wrap">
        <div styleName="confirm-text">{text}</div>
        <div styleName="confirm-button" onClick={() => { confirm(() => { close() }) }}>{buttonText}</div>
      </div>
    </Dialog>
  )
}

export default Confirm