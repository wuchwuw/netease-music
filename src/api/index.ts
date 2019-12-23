import home from './modules/home'
import playlist from './modules/playlist'
import comment from './modules/comment'
import commen from './modules/commen'
import song from './modules/song'
import user from './modules/user'

export default {
  ...home,
  ...playlist,
  ...comment,
  ...commen,
  ...song,
  ...user
}