import cityjson from './city.json'
import proincejson from './province.json'

export interface City {
  code: number
  name: string
}

export interface Province {
  code: number
  name: string
}

export const city: City[] = cityjson
export const province: Province[] = proincejson

export const getCity = (cityId: number): City | undefined => {
  return city.find(item => Number(item.code) === cityId)
}

export const getProvince = (provinceId: number): Province | undefined => {
  return province.find(item => Number(item.code) === provinceId)
}

export const getCityName = (cityId: number) => {
  if (!cityId) return ''
  const city = getCity(cityId)
  return city ? city.name : ''
}

export const getProvinceName = (provinceId: number) => {
  if (!provinceId) return ''
  const province = getProvince(provinceId)
  return province ? province.name : ''
}