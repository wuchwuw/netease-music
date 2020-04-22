export function checkLoginStatus () {
  const cookie = document.cookie
  return cookie.indexOf('MUSIC_U=') > -1
}

export function refresh () {}