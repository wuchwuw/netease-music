import { createStore, applyMiddleware } from 'redux'
// import { createLogger } from 'redux-logger'
import rootReducer from './reducers'
import { state } from './state'
// import thunkMiddleware from 'redux-thunk'

// const loggerMiddleware = createLogger()
export default function configureStore() {
  return createStore(
    rootReducer,
    state
    // applyMiddleware(
    //   loggerMiddleware,
    //   thunkMiddleware
    // )
  )
}