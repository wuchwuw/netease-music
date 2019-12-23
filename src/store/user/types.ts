import User from 'UTIL/user'

export const SET_USER_PROFILE = 'SET_USER_PROFILE'
export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS'

interface SET_USER_PROFILE {
  type: typeof SET_USER_PROFILE
  user: User
}

interface SET_LOGIN_STATUS {
  type: typeof SET_LOGIN_STATUS
  isLogin: boolean
}

export interface UserState {
  user: User,
  isLogin: boolean
}

export type UserActionTypes = 
  SET_USER_PROFILE |
  SET_LOGIN_STATUS