import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE,
  SET_FAVORITE_IDS
} from './types'

import { PanelType } from 'VIEWS/panel/container'

const initialState: CommenState = {
  panelType: PanelType.Close,
  favoriteIds: []
}

export function CommenReducer (state = initialState, action: CommenActionTypes): CommenState {
  switch (action.type) {
    case SET_PANEL_TYPE:
      state.panelType = action.panelType
      return state
    case SET_FAVORITE_IDS:
      state.favoriteIds = action.favoriteIds
      return state
    default:
      return state
  }
}