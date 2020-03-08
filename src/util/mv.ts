export class MVBaseClass {
  id: number
  name: string
  playCount: number
  subCount: number
  shareCount: number
  likeCount: number
  commentCount: number
  duration: number
  publishTime: string

  constructor ({
    id,
    name,
    playCount
  }: any) {

  }
}