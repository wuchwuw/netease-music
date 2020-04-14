import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE,
  SET_FAVORITE_IDS,
  SET_SEARCH_KEYWORDS,
  SET_HISTORY_KEYWORDS
} from './types'

import { PanelType } from 'VIEWS/panel/container'

const initialState: CommenState = {
  panelType: PanelType.Close,
  favoriteIds: [],
  keywords: '',
  historyKeywords: JSON.parse(localStorage.getItem('historyKeywords') || '[]')
}

export function CommenReducer (state = initialState, action: CommenActionTypes): CommenState {
  switch (action.type) {
    case SET_PANEL_TYPE:
      state.panelType = action.panelType
      return state
    case SET_FAVORITE_IDS:
      state.favoriteIds = action.favoriteIds
      return state
    case SET_SEARCH_KEYWORDS:
      state.keywords = action.keywords
      return state
    case SET_HISTORY_KEYWORDS:
      const index = state.historyKeywords.indexOf(action.keywords)
      if (index > -1) {
        state.historyKeywords.splice(index, 1)
      }
      state.historyKeywords.unshift(action.keywords)
      localStorage.setItem('historyKeywords', JSON.stringify(state.historyKeywords))
      return state
    default:
      return state
  }
}