import { playerReducer } from './player/reducers'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  player: playerReducer
})

export default rootReducer