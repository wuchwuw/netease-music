export class ArtistBaseClass {
  id: number
  name: string
  picUrl: string
  img1v1Url: string

  constructor ({ id, name, picUrl, img1v1Url } : any) {
    this.id = id
    this.name = name
    this.picUrl = picUrl
    this.img1v1Url = img1v1Url
  }
}

export function createBaseArtistList (data: any): ArtistBaseClass[] {
  return data.map((item: any) => {
    return new ArtistBaseClass(item)
  })
}

export class Artist extends  ArtistBaseClass{
  musicSize: number
  albumSize: number
  mvSize: number
  followed: boolean
  accountId: number
  alias: string[]
  constructor ({ 
    id,
    name, 
    picUrl,
    img1v1Url, 
    musicSize,
    albumSize,
    mvSize,
    followed,
    accountId,
    alias = []
  } : any) {
    super({ id, name, picUrl, img1v1Url })
    this.musicSize = musicSize
    this.albumSize = albumSize
    this.mvSize = mvSize
    this.followed = followed
    this.accountId = accountId
    this.alias = alias
  }
}

export function createArtist (data: any): Artist {
  return new Artist(data)
}