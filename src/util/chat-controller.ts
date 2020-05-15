import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'STORE/index'
import { SET_CURRENT_CHAT, SET_PANEL_TYPE } from 'STORE/commen/types'
import User from './user'

export function useChat () {
  const currentChat = useSelector((state: RootState) => state.commen.currentChat)
  const dispatch = useDispatch()

  function setCurrentChat (chat: User) {
    dispatch({ type: SET_CURRENT_CHAT, currentChat: chat })
    dispatch({ type: SET_PANEL_TYPE, panelType: 'chat' })
  }

  return {
    currentChat,
    setCurrentChat
  }
}