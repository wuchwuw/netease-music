export const light = {
  '--main-color': '#D33931',
  '--main-background': '#FFFFFF',
  '--main-background-deep': '#FFFFFF',
  /* topbar */
  '--topbar-background': '#F9F9F9',
  '--topbar-search': '#EDEDED',
  /* leftbar */
  '--leftbar-background': '#EDEDED',
  '--leftbar-background-active': '#E2E2E2',
  /* bottombar */
  '--player-progress-default': '#F5F5F5',
  /* text */
  '--text-0': '#000000',
  '--text-3': '#333333',
  '--text-6': '#666666',
  '--text-9': '#999999',
  '--text-c': '#CCCCCC',
  /* musiclist */
  '--musiclist-background-even': '#FAFAFA',
  '--musiclist-background-active': '#F2F2F2',
  '--musiclist-background-hover': '#F2F2F2',

  /* scroll bar */
  '--scrollbar-thumb': '#e1e1e1',

  /* commen */
  '--border': '#F3F3F3',
  '--border-deep': '#D9D9D9',
  '--default-background': '#F5F5F5',
  '--default-background-deep': '#EDEDED',
  '--color-white': '#FFFFFF',
  '--context-menu-background': '#F0F2F1',

  /* tab */
  '--tab-background': '#BBBBBB',
  '--tab-background-hover': '#F8F5F5'
}

export const dark = {
  '--main-color': '#D33931',
  '--main-background': '#252525',
  '--main-background-deep': '#363636',
  /* topbar */
  '--topbar-background': '#2A2A2A',
  '--topbar-search': '#4C4C4C',
  /* leftbar */
  '--leftbar-background': '#2C2C2C',
  '--leftbar-background-active': '#191919',
  /* bottombar */
  '--player-progress-default': '#232323',
  /* text */
  '--text-0': '#FFFFFF',
  '--text-3': '#B2B2B2',
  '--text-6': '#878787',
  '--text-9': '#5C5C5C',
  '--text-c': '#5F5F5F',
  /* musiclist */
  '--musiclist-background-even': '#2A2A2A',
  '--musiclist-background-active': '#343434',
  '--musiclist-background-hover': '#343434',

  /* scroll bar */
  '--scrollbar-thumb': '#414141',

  /* commen */
  /* border */
  '--border': '#313131',
  '--border-deep': '#454545',
  '--default-background': '#2F2F2F',
  '--default-background-deep': '#3C3C3C',
  '--color-white': '#252525',
  '--context-menu-background': '#333333',

  /* tab */
  '--tab-background': '#666666',
  '--tab-background-hover': '#3F3F3F'
}

const TYPE_MAP = {
  light,
  dark
}

export function setGlobalCSSVar (type: 'light' | 'dark') {
  const vars = TYPE_MAP[type] as typeof light
  (Object.keys(vars) as Array<keyof typeof vars>).forEach((key) => {
    document.body.style.setProperty(key, vars[key])
  })
  localStorage.setItem('mode', type)
}

export const defaultMode = (localStorage.getItem('mode') || 'light') as keyof typeof TYPE_MAP

export function initGlobalCSSVar () {
  setGlobalCSSVar(defaultMode)
}