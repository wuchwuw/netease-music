import api from 'API/index'

export function checkLoginStatus () {
  const cookie = document.cookie
  return cookie.indexOf('MUSIC_U=') > -1
}

export async function refresh () {
  if (checkLoginStatus()) {
    try {
      await api.refreshLogin()
    } catch (e) {}
  } else {
    // todo clear localstorage
  }
}