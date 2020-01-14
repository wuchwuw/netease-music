export class ArtistBaseClass {
  id: number
  name: string
  picUrl: string

  constructor ({ id, name, picUrl } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
  }
}

export function createBaseArtistList (data: any): ArtistBaseClass[] {
  return data.map((item: any) => {
    return new ArtistBaseClass(item)
  })
}