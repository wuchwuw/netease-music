export class AlbumBaseClass {
  id: number
  name: string
  picUrl: string
  artists: any

  constructor ({ id, name, picUrl, artists } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
    this.artists = artists
  }

  get artistName (): string {
    if (!this.artists.length) return ''
    return this.artists.reduce((name: string, item: any) => {
      return name + '/' + item.name
    }, '').substring(1)
  }
}

export function createBaseAlbumList (data: any): AlbumBaseClass[] {
  return data.map((item: any) => {
    return new AlbumBaseClass(item)
  })
}