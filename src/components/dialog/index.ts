import { useState } from 'react'
import LoginDialog from './login/login-dialog'

export interface UseDialogProps {
  visible: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

function useDialog (): UseDialogProps {
  const [visible, setVisible] = useState(false)
  const open = () => setVisible(true)
  const close = () => setVisible(false)
  const toggle = () => setVisible(!visible)

  return {
    visible,
    open,
    close,
    toggle
  }
}

export {
  LoginDialog,
  useDialog
}