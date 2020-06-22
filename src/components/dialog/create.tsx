import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import VipDialog from 'COMPONENTS/dialog/vip/vip-dialog'
import ActivityPublish from 'COMPONENTS/dialog/activity-publish/activity-publish'
import React from 'react'
import ReactDOM from 'react-dom'

export const COMFIRM_DIALOG = 'confirm-container'
export const VIP_DIALOG = 'vip-container'
export const SHARE_ACTIVITY_DIALOG = 'share_activity_dialog'
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
      case SHARE_ACTIVITY_DIALOG:
        return () => {
          ReactDOM.render(<ActivityPublish {...defaultProps}></ActivityPublish>, createContainer())
        }
      default:
        return () => {}
    }
  }

  return {
    open: getOpen()
  }
}
