import { playerReducer } from './player/reducers'
import { UserReducer } from './user/reducers'
import { CommenReducer } from './commen/reducers'
import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  player: playerReducer,
  user: UserReducer,
  commen: CommenReducer
})

export default rootReducer