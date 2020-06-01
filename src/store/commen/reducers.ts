import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE,
  SET_FAVORITE_IDS,
  SET_SEARCH_KEYWORDS,
  SET_HISTORY_KEYWORDS,
  SET_UPDATE_FAVORITE_PLAYLIST,
  SET_CURRENT_CHAT,
  SET_LOGIN_DIALOG_VISIBLE
} from './types'

import { PanelType } from 'VIEWS/panel/container'
import User from 'UTIL/user'

const initialState: CommenState = {
  panelType: PanelType.Close,
  currentChat: {} as User,
  favoriteIds: [],
  keywords: '',
  historyKeywords: JSON.parse(localStorage.getItem('historyKeywords') || '[]'),
  shouldUpdateFavoritePlaylist: false,
  loginDialogVisible: false
}

export function CommenReducer (state = initialState, action: CommenActionTypes): CommenState {
  switch (action.type) {
    case SET_PANEL_TYPE:
      state.panelType = action.panelType
      return state
    case SET_FAVORITE_IDS:
      state.favoriteIds = [...action.favoriteIds]
      return state
    case SET_SEARCH_KEYWORDS:
      state.keywords = action.keywords
      return state
    case SET_HISTORY_KEYWORDS:
      state.historyKeywords = [...action.history]
      localStorage.setItem('historyKeywords', JSON.stringify(state.historyKeywords))
      return state
    case SET_UPDATE_FAVORITE_PLAYLIST:
      state.shouldUpdateFavoritePlaylist = !state.shouldUpdateFavoritePlaylist
      return state
    case SET_CURRENT_CHAT:
      state.currentChat = action.currentChat
      return state
    case SET_LOGIN_DIALOG_VISIBLE:
      state.loginDialogVisible = action.loginDialogVisible
      return state
    default:
      return state
  }
}