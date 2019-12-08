export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'

import { combineReducers } from 'redux'

function currentSong (initState = {}, action: any) {
  switch (action.type) {
    case SET_CURRENT_SONG:
      return action.currentSong
    default:
      return initState
  }
}

const rootReducer = combineReducers({
  currentSong
})

export default rootReducer