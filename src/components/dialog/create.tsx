import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import VipDialog from 'COMPONENTS/dialog/vip/vip-dialog'
import ActivityPublish, { ActivityPublishProps } from 'COMPONENTS/dialog/activity-publish/activity-publish'
import React from 'react'
import ReactDOM from 'react-dom'

export const COMFIRM_DIALOG = 'confirm-container'
export const VIP_DIALOG = 'vip-container'
export const SHARE_ACTIVITY_DIALOG = 'share_activity_dialog'
const parent = document.body

interface ActivityPublishOpen {
  type: typeof SHARE_ACTIVITY_DIALOG
  open: (props: ActivityPublishProps) => void
}

interface ComfirmOpen {
  type: typeof COMFIRM_DIALOG
  open: (props: ConfirmProps) => void
}

type CreateDialogType = ActivityPublishOpen | ComfirmOpen

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

  function getOpen (): CreateDialogType {
    let open: any
    switch (dialogName) {
      case COMFIRM_DIALOG:
        open = (props: ConfirmProps) => {
          ReactDOM.render(<Confirm {...props} {...defaultProps}></Confirm>, createContainer())
        }
        break;
      case VIP_DIALOG:
        open = () => {
          ReactDOM.render(<VipDialog {...defaultProps}></VipDialog>, createContainer())
        }
        break;
      case SHARE_ACTIVITY_DIALOG:
        open = (props: ActivityPublishProps) => {
          ReactDOM.render(<ActivityPublish {...props} {...defaultProps}></ActivityPublish>, createContainer())
        }
        break;
      default:
        open = () => {}
        break;
    }
    return { type: dialogName, open } as CreateDialogType
  }

  return {
    open: getOpen().open
  }
}
