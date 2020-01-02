import {
  CommenState,
  CommenActionTypes,
  SET_PANEL_TYPE
} from './types'

const initialState: CommenState = {
  panelType: 'close'
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