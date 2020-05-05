import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import React from 'react'
import ReactDOM from 'react-dom'

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