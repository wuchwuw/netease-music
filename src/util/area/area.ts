
import areajson from './area.json'

export interface AreaItem {
  id: number
  name: string
}

export interface Area {
  id: number
  name: string
  cities: {
    id: number
    name: string
  }[]
}

export const area: Area[] = getArea(areajson)

function getArea (area: any): Area[] {
  return area.map((item: any) => {
    let res = {
      id: item.id,
      name: item.name,
      cities: Object.keys(item.cities).map((key: any) => ({
        id: Number(key),
        name: item.cities[key]
      }))
    }
    return res
  })
}

export const getCities = (provinceId: number) => {
  const province = area.find(item => item.id === provinceId)
  return province ? province.cities : []
}

export const getAreaName = (provinceId: number, cityId: number) => {
  const province = area.find(item => item.id === provinceId)
  const city = province && province.cities.find(item => item.id === cityId)
  return {
    provinceName: province ? province.name : '',
    cityName: city ? city.name : ''
  }
}