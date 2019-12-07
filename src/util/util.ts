export function padZero(n: number) {
  return n <= 9 ? `0${n}` : n
}

export function getSongTime (time: number) {
  time = Math.ceil(time / 1000)
  let min = Math.floor(time / 60)
  let s = time - min * 60
  return `${padZero(min)}:${padZero(s)}`
}