export class AlbumBaseClass {
  id: number
  name: string
  picUrl: string

  constructor ({ id, name, picUrl } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
  }
}

export function createBaseAlbumList (data: any): AlbumBaseClass[] {
  return data.map((item: any) => {
    return new AlbumBaseClass(item)
  })
}