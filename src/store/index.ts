import { createStore, applyMiddleware } from 'redux'
// import { createLogger } from 'redux-logger'
import rootReducer from './reducers'
// import { state } from './state'
// import thunkMiddleware from 'redux-thunk'

// const loggerMiddleware = createLogger()
export default function configureStore() {
  return createStore(
    rootReducer
  )
}

export const store = createStore(
  rootReducer
  // applyMiddleware(
  //   loggerMiddleware,
  //   thunkMiddleware
  // )
)

export type RootState = ReturnType<typeof rootReducer>