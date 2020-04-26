import api from 'API/index'
import Cookies from 'js-cookie'

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
  localStorage.removeItem('user')
  localStorage.removeItem('playlist')
}