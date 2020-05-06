import User from 'UTIL/user'
import { PlaylistClass } from 'UTIL/playlist'

export const SET_USER_PROFILE = 'SET_USER_PROFILE'
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS'
export const SET_USER_PLAYLIST = 'SET_USER_PLAYLIST'

interface SET_USER_PROFILE {
  type: typeof SET_USER_PROFILE
  user: User
}

interface SET_LOGIN_STATUS {
  type: typeof SET_LOGIN_STATUS
  isLogin: boolean
}

interface SET_USER_PLAYLIST {
  type: typeof SET_USER_PLAYLIST
  playlist: PlaylistClass[]
}

export interface UserState {
  user: User,
  isLogin: boolean,
  playlist: PlaylistClass[]
}

export type UserActionTypes = 
  SET_USER_PROFILE |
  SET_LOGIN_STATUS |
  SET_USER_PLAYLIST