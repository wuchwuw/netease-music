import { UserBaseClass, createBaseUser } from 'UTIL/user'

export class DjBaseClass {
  id: number
  dj: UserBaseClass
  name: string
  picUrl: string

  constructor ({ id, dj = {}, name, picUrl }: any) {
    this.id = id
    this.dj = createBaseUser(dj)
    this.name = name
    this.picUrl = picUrl
  }
}

export function createBaseDjList (data: any): DjBaseClass[] {
  return data.map((item: any) => {
    return new DjBaseClass({
      id: item.id,
      dj: item.dj,
      name: item.name,
      picUrl: item.picUrl
    })
  })
}