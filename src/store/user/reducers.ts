import {
  UserState,
  UserActionTypes,
  SET_USER_PROFILE,
  SET_LOGIN_STATUS
} from './types'
import User from 'UTIL/user'

const user = JSON.parse(localStorage.getItem('user') || '{}') as User
const isLogin = !!user.userId

const initialState: UserState = {
  user,
  isLogin
}
console.log(initialState)

export function UserReducer (state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    case SET_USER_PROFILE:
      localStorage.setItem('user', JSON.stringify(action.user))
      state.user = action.user
      return state
    case SET_LOGIN_STATUS:
      state.isLogin = action.isLogin
      return state
    default:
      return state
  }
}