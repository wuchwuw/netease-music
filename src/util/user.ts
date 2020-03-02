interface AuthType {
  type: number
  desc: string
}

export default class User {
  avatarUrl: string
  description: string
  detailDescription: string
  followed: boolean
  nickname: string
  signature: string
  followeds: number
  follows: number
  userId: number
  userType: number
  vipType: number
  birthday: number
  createTime: number
  province: number
  city: number
  eventCount: number
  level: number
  mainAuthType: AuthType
  allAuthTypes: AuthType[]
  artistId: number
  gender: number

  constructor ({
    avatarUrl,
    description,
    detailDescription,
    followed,
    nickname,
    signature,
    followeds,
    follows,
    userId,
    userType,
    vipType,
    birthday,
    createtTime,
    province,
    city,
    eventCount,
    level,
    mainAuthType,
    allAuthTypes = [],
    artistId,
    gender
  }: any) {
    this.avatarUrl = avatarUrl
    this.description = description
    this.detailDescription = detailDescription
    this.followed = followed
    this.nickname = nickname
    this.signature = signature
    this.followeds = followeds
    this.follows = follows
    this.userId = userId
    this.userType = userType
    this.vipType = vipType
    this.birthday = birthday
    this.createTime = createtTime
    this.province = province
    this.city = city
    this.eventCount = eventCount
    this.level = level
    this.mainAuthType = mainAuthType
    this.allAuthTypes = allAuthTypes
    this.artistId = artistId
    this.gender = gender
  }
}

export class UserBaseClass {
  userId: number
  nickname: string
  avatarUrl: string

  constructor ({ userId, nickname, avatarUrl }: any) {
    this.userId = userId
    this.nickname = nickname
    this.avatarUrl = avatarUrl
  }
}

export function createBaseUser (data: any): UserBaseClass {
  return new UserBaseClass({
    userId: data.userId,
    nickname: data.nickname,
    avatarUrl: data.avatarUrl
  })
}

export function createBaseUserList (data: any): UserBaseClass[] {
  return data.map((item: any) => {
    return new UserBaseClass({
      userId: item.userId,
      nickname: item.nickname,
      avatarUrl: item.avatarUrl
    })
  })
}

export function createUserDetail (data: any): User {
  return new User({
    level: data.level,
    ...data.profile
  })
}