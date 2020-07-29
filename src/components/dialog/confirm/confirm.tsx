import React, { useState } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import { UseDialogProps } from '..'
import './confirm.less'
import Button from 'COMPONENTS/button/button'

export interface ConfirmProps {
  confirm: (callback?: () => void) => void
  text: string
  buttonText: string,
  confirmLoading?: boolean
}

const Confirm: React.SFC<ConfirmProps & UseDialogProps> = ({
  visible,
  open,
  close,
  toggle,
  confirm,
  text,
  buttonText,
  confirmLoading = false
}) => {
  const [loading, setLoading] = useState(false)
  function confirmFn () {
    confirmLoading && setLoading(true)
    confirm(() => {
      confirmLoading && setLoading(false)
      close()
    })
  }

  return (
    <Dialog width={400} {...{visible, open, close, toggle}}>
      <div styleName="confirm-wrap">
        <div styleName="confirm-text">{text}</div>
        <div styleName="confirm-button">
          <Button loading={loading} type="primary" onClick={() => { confirmFn() }}>{buttonText}</Button>
        </div>
      </div>
    </Dialog>
  )
}

export default Confirm