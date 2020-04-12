import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE,
  SET_FAVORITE_IDS,
  SET_SEARCH_KEYWORD,
  SET_HISTORY_KEYWORDS
} from './types'

import { PanelType } from 'VIEWS/panel/container'

const initialState: CommenState = {
  panelType: PanelType.Close,
  favoriteIds: [],
  keyword: '',
  historyKeywords: []
}

export function CommenReducer (state = initialState, action: CommenActionTypes): CommenState {
  switch (action.type) {
    case SET_PANEL_TYPE:
      state.panelType = action.panelType
      return state
    case SET_FAVORITE_IDS:
      state.favoriteIds = action.favoriteIds
      return state
    case SET_SEARCH_KEYWORD:
      state.keyword = action.keyword
      return state
      case SET_HISTORY_KEYWORDS:
        state.historyKeywords = action.historyKeywords
        return state
    default:
      return state
  }
}