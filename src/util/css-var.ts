export const light = {
  '--main-background': '#FFFFFF',
  '--topbar-background': '#F9F9F9'
}

export const dark = {
  '--main-background': '#000000',
  '--topbar-background': '#000000'
}

const TYPE_MAP = {
  light,
  dark
}


export function setGlobalCSSVar (type: 'light' | 'dark') {
  const vars = TYPE_MAP[type]
  Object.keys(vars).forEach((key: any) => {
    document.body.style.setProperty(key, vars[key])
  })
}