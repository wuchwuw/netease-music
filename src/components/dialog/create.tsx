import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import React from 'react'
import ReactDOM from 'react-dom'
import LoginDialog from 'COMPONENTS/dialog/login/login-dialog'

const CONTAINER_NAME = 'confirm-container'
const parent = document.body

export function useConfirm () {
  const confirmProps = {
    visible: true,
    open: () => {},
    toggle: () => {},
    close: () => {
      const container = document.getElementById(CONTAINER_NAME)
      if (container) {
        parent.removeChild(container)
      }
    }
  }

  function open (props: ConfirmProps) {
    const container = document.createElement('div')
    container.setAttribute('id', CONTAINER_NAME)
    parent.appendChild(container)
    ReactDOM.render(<Confirm {...props} {...confirmProps}></Confirm>, container)
  }
  return {
    open
  }
}

const LOGIN_DIALOG_CONTAINER = 'LOGIN_DIALOG_CONTAINER'

export const loginDialog = {
  open () {
    const container = document.createElement('div')
    container.setAttribute('id', LOGIN_DIALOG_CONTAINER)
    parent.appendChild(container)
    const props = {
      visible: true,
      toggle: () => {},
      open: () => {},
      close: () => {
        const container = document.getElementById(LOGIN_DIALOG_CONTAINER)
        if (container) {
          parent.removeChild(container)
        }
      }
    }
    ReactDOM.render(<LoginDialog {...props}></LoginDialog>, container)
  }
}