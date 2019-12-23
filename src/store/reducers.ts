import { playerReducer } from './player/reducers'
import { UserReducer } from './user/reducers'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  player: playerReducer,
  user: UserReducer
})

export default rootReducer