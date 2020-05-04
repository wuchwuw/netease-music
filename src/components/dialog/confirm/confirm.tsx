import React from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import { UseDialogProps } from '..'

interface ConfirmAction {
  confirm: () => void
}

const Confirm: React.SFC<ConfirmAction & UseDialogProps> = (props) => {
  return (
    <Dialog width={500} {...props as UseDialogProps}>
      <div>xxxxxx</div>
    </Dialog>
  )
}

export default Confirm