import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE
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
    default:
      return state
  }
}