import {
  UserState,
  UserActionTypes,
  SET_USER_PROFILE,
  SET_LOGIN_STATUS,
  SET_USER_PLAYLIST
} from './types'
import User from 'UTIL/user'
import { PlaylistBaseClass } from 'UTIL/playlist'

const user = JSON.parse(localStorage.getItem('user') || '{}') as User
const playlist = JSON.parse(localStorage.getItem('playlist') || '[]') as PlaylistBaseClass[]
const isLogin = !!user.userId

const initialState: UserState = {
  user,
  isLogin,
  playlist
}

export function UserReducer (state = initialState, action: UserActionTypes): UserState {
  switch (action.type) {
    case SET_USER_PROFILE:
      localStorage.setItem('user', JSON.stringify(action.user))
      state.user = action.user
      return state
    case SET_LOGIN_STATUS:
      state.isLogin = action.isLogin
      return state
    case SET_USER_PLAYLIST:
      localStorage.setItem('playlist', JSON.stringify(action.playlist))
      state.playlist = action.playlist
      return state
    default:
      return state
  }
}