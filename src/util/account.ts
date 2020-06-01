import api from 'API/index'
import Cookies from 'js-cookie'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import { useFavorite } from 'UTIL/favorite'
import { useUserPlaylist } from 'UTIL/user-playlist'

export function checkLoginStatus () {
  return !!Cookies.get('__csrf')
}

export async function refresh () {
  if (checkLoginStatus()) {
    try {
      await api.refreshLogin()
    } catch (e) {}
  } else {
    logout()
  }
}

export function logout () {
  Cookies.remove('__csrf')
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.userId) {
    localStorage.removeItem('user')
    localStorage.removeItem('playlist')
    window.location.href = window.location.origin
  }
}

export function useAccountInit () {
  const user = useSelector((state: RootState) => state.user.user)
  const { getFavoriteIds } = useFavorite()
  const { getUserPlaylist } = useUserPlaylist()
  
  function initAccount () {
    if (checkLoginStatus()) {
      getFavoriteIds(user.userId)
      getUserPlaylist(user.userId)
    }
  }

  return {
    initAccount
  }
}