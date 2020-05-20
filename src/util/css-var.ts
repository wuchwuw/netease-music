export const light = {
  '--main-background': '#FFFFFF',
  /* topbar */
  '--topbar-background': '#F8F8F9',
  '--topbar-search': '#EDEDED',
  /* leftbar */
  '--leftbar-background': '#EDEDED',
  '--leftbar-background-active': '#E2E2E2',
  /* bottombar */
  '--player-progress-default': '#F5F5F5',
  /* text */
  '--text-main': '#333333',
  '--text-mid': '#666666',
  /* musiclist */
  '--musiclist-background-even': '#FAFAFA',
  '--musiclist-background-active': '#F2F2F2',
  '--musiclist-background-hover': '#F2F2F2',

  /* border */
  '--border': '#F3F3F3',

  /* scroll bar */
  '--scrollbar-thumb': '#e1e1e1'
}

export const dark = {
  '--main-background': '#252525',
  /* topbar */
  '--topbar-background': '#2A2A2A',
  '--topbar-search': '#4C4C4C',
  /* leftbar */
  '--leftbar-background': '#2C2C2C',
  '--leftbar-background-active': '#191919',
  /* bottombar */
  '--player-progress-default': '#232323',
  /* text */
  '--text-main': '#B2B2B2',
  '--text-mid': '#B6B6B6',
  '--text-light': '#5C5C5C',
  '--text-failt': '#5F5F5F',
  /* musiclist */
  '--musiclist-background-even': '#2A2A2A',
  '--musiclist-background-active': '#343434',
  '--musiclist-background-hover': '#343434',

  /* border */
  '--border': '#313131',

  /* scroll bar */
  '--scrollbar-thumb': '#414141'
}

const TYPE_MAP = {
  light,
  dark
}

export function setGlobalCSSVar (type: 'light' | 'dark') {
  const vars = TYPE_MAP[type]
  Object.keys(vars).forEach((key) => {
    document.body.style.setProperty(key, vars[key])
  })
}