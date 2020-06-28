import React from 'react'
import ReactDOM from 'react-dom'
import Confirm, { ConfirmProps } from 'COMPONENTS/dialog/confirm/confirm'
import VipDialog from 'COMPONENTS/dialog/vip/vip-dialog'
import ActivityPublish, { ActivityPublishProps } from 'COMPONENTS/dialog/activity-publish/activity-publish'
import AddPlaylistDialog, { AddPlaylistDialogProps } from 'COMPONENTS/dialog/add-playlist/add-playlist'
import ShareDialog, { ShareDialogProps } from 'COMPONENTS/dialog/share/share-dialog'
export { ShareType } from 'COMPONENTS/dialog/activity-publish/activity-publish'

export const COMFIRM_DIALOG = 'confirm-container'
export const VIP_DIALOG = 'vip-container'
export const SHARE_ACTIVITY_DIALOG = 'share_activity_dialog'
export const ADD_PLAYLIST_SONGS_DIALOG = 'ADD_PLAYLIST_SONGS_DIALOG'
export const SHARE_DIALOG = 'SHARE_DIALOG'

type DialogNameType = 
  typeof COMFIRM_DIALOG | 
  typeof VIP_DIALOG | 
  typeof SHARE_ACTIVITY_DIALOG | 
  typeof ADD_PLAYLIST_SONGS_DIALOG |
  typeof SHARE_DIALOG

const parent = document.body

function createContainer (dialogName: DialogNameType) {
  const container = document.createElement('div')
  container.setAttribute('id', dialogName)
  parent.appendChild(container)
  return container
}

function getDefaultProps (dialogName: DialogNameType) {
  return {
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
}

export function createComfirmDialog () {
  const defaultProps = getDefaultProps(COMFIRM_DIALOG)
  return (props: ConfirmProps) => {
    ReactDOM.render(<Confirm {...props} {...defaultProps}></Confirm>, createContainer(COMFIRM_DIALOG))
  }
}

export function createCheckVipDialog () {
  const defaultProps = getDefaultProps(VIP_DIALOG)
  return () => {
    ReactDOM.render(<VipDialog {...defaultProps}></VipDialog>, createContainer(VIP_DIALOG))
  }
}

export function createActivityPublishDialog () {
  const defaultProps = getDefaultProps(SHARE_ACTIVITY_DIALOG)
  return (props: ActivityPublishProps) => {
    ReactDOM.render(<ActivityPublish {...props} {...defaultProps}></ActivityPublish>, createContainer(SHARE_ACTIVITY_DIALOG))
  }
}

export function createAddPlaylistSongDialog () {
  const defaultProps = getDefaultProps(ADD_PLAYLIST_SONGS_DIALOG)
  return (props: AddPlaylistDialogProps) => {
    ReactDOM.render(<AddPlaylistDialog {...props} {...defaultProps}></AddPlaylistDialog>, createContainer(ADD_PLAYLIST_SONGS_DIALOG))
  }
}

export function createShareDialog () {
  const defaultProps = getDefaultProps(SHARE_DIALOG)
  return (props: ShareDialogProps) => {
    ReactDOM.render(<ShareDialog {...props} {...defaultProps}></ShareDialog>, createContainer(SHARE_DIALOG))
  }
}