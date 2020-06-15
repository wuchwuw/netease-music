import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import VipDialog from 'COMPONENTS/dialog/vip/vip-dialog'
import React from 'react'
import ReactDOM from 'react-dom'

export const COMFIRM_DIALOG = 'confirm-container'
export const VIP_DIALOG = 'vip-container'
const parent = document.body

export function useCreateDialog (dialogName: string) {
  const defaultProps = {
    visible: true,
    open: () => {},
    toggle: () => {},
    close: () => {
      const container = document.getElementById(dialogName)
      if (container) {
        parent.removeChild(container)
      }
    }
  }

  function createContainer () {
    const container = document.createElement('div')
    container.setAttribute('id', dialogName)
    parent.appendChild(container)
    return container
  }

  function getOpen () {
    switch (dialogName) {
      case COMFIRM_DIALOG:
        return (props: ConfirmProps) => {
          ReactDOM.render(<Confirm {...props} {...defaultProps}></Confirm>, createContainer())
        }
      case VIP_DIALOG:
        return () => {
          ReactDOM.render(<VipDialog {...defaultProps}></VipDialog>, createContainer())
        }
      default:
        return () => {}
    }
  }

  return {
    open: getOpen()
  }
}
