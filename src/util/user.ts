class BaseUser {}

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
    birthday
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
  }
}