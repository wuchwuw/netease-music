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
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  if (user.userId) {
    localStorage.removeItem('user')
    localStorage.removeItem('playlist')
    window.location.href = window.location.origin
  }
}