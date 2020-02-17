import home from './modules/home'
import playlist from './modules/playlist'
import comment from './modules/comment'
import commen from './modules/commen'
import song from './modules/song'
import user from './modules/user'
import artist from './modules/artist'
import radio from './modules/radio'
import video from './modules/video'
import activity from './modules/activity'

export default {
  ...home,
  ...playlist,
  ...comment,
  ...commen,
  ...song,
  ...user,
  ...artist,
  ...radio,
  ...video,
  ...activity
}