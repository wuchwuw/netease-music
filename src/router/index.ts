import loadable from '@loadable/component'
import App from '../app'
import { RouteConfig } from 'react-router-config'
import { createRedirect } from './redirect'
const HomeRecomend = loadable(() => import('VIEWS/home/recomend/recomend'))
const HomePlaylist = loadable(() => import('VIEWS/home/playlist/playlist'))
const HomeToplist = loadable(() => import('VIEWS/home/toplist/toplist'))
const HomeArtist = loadable(() => import('VIEWS/home/artist/artist'))
const HomeNew = loadable(() => import('VIEWS/home/new/new'))
const HomeRadio = loadable(() => import('VIEWS/home/radio/radio'))
const Home = loadable(() => import('VIEWS/home/index'))
const Playlist = loadable(() => import('VIEWS/playlist/playlist'))
const Search = loadable(() => import('VIEWS/search/search'))
const Video = loadable(() => import('VIEWS/video/video/video'))
const VideoContainer = loadable(() => import('VIEWS/video/index'))
const MvRecomend = loadable(() => import('VIEWS/video/mv/mv'))
const Friends = loadable(() => import('VIEWS/friends/friends'))
const FM = loadable(() => import('VIEWS/fm/fm'))
const User = loadable(() => import('VIEWS/user/user'))
const Artist = loadable(() => import('VIEWS/artist/artist'))
const Album = loadable(() => import('VIEWS/album/album'))
const VideoDetail = loadable(() => import('VIEWS/video-detail/video-detail'))
const MVDetail = loadable(() => import('VIEWS/video-detail/mv-detail'))
const StarAlbum = loadable(() => import('VIEWS/star/album/album'))
const StarArtist = loadable(() => import('VIEWS/star/artist/artist'))
const StarVideo = loadable(() => import('VIEWS/star/video/video'))
const StarContainer = loadable(() => import('VIEWS/star/index'))
const Cloud = loadable(() => import('VIEWS/cloud/cloud'))

const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
      {
        path: '/',
        exact: true,
        component: createRedirect('/home/index')
      },
      {
        path: '/home',
        exact: true,
        component: createRedirect('/home/index')
      },
      {
        path: '/video',
        exact: true,
        component: createRedirect('/video/index')
      },
      {
        path: '/playlist/:id',
        component: Playlist,
      },
      {
        path: '/playlist-edit/:id',
        component: loadable(() => import('VIEWS/playlist-edit/playlist-edit'))
      },
      {
        path: '/fm',
        component: FM,
        needLogin: true,
        state: {
          needLogin: true
        }
      },
      {
        path: '/artist/:id',
        component: Artist
      },
      {
        path: '/album/:id',
        component: Album
      },
      {
        path: '/v/:id',
        component: VideoDetail
      },
      {
        path: '/m/:id',
        component: MVDetail
      },
      {
        path: '/home',
        component: Home,
        routes: [
          {
            path: '/home/index',
            component: HomeRecomend
          },
          {
            path: '/home/playlist',
            component: HomePlaylist
          },
          {
            path: '/home/toplist',
            component: HomeToplist
          },
          {
            path: '/home/artist',
            component: HomeArtist
          },
          {
            path: '/home/new',
            component: HomeNew
          },
          {
            path: '/home/radio',
            component: HomeRadio
          }
        ]
      },
      {
        path: '/search',
        component: Search
      },
      {
        path: '/video',
        component: VideoContainer,
        routes: [
          {
            path: '/video/index',
            component: Video
          },
          {
            path: '/video/mv',
            component: MvRecomend
          }
        ]
      },
      {
        path: '/activity',
        component: Friends
      },
      {
        path: '/star',
        exact: true,
        component: createRedirect('/star/album')
      },
      {
        path: '/star',
        component: StarContainer,
        routes: [
          {
            path: '/star/album',
            component: StarAlbum
          },
          {
            path: '/star/artist',
            component: StarArtist
          },
          {
            path: '/star/video',
            component: StarVideo
          }
        ]
      },
      {
        path: '/cloud',
        component: Cloud,
        name: 'aaa'
      },
      {
        path: '/user/:id',
        component: User
      },
      {
        path: '/follows/:userId',
        component: loadable(() => import('VIEWS/user/follows/follows'))
      },
      {
        path: '/followeds/:userId',
        component: loadable(() => import('VIEWS/user/followeds/followeds'))
      },
      {
        path: '/event/:userId',
        component: loadable(() => import('VIEWS/user/event/event'))
      },
      {
        path: '/daily',
        component: loadable(() => import('VIEWS/daily/daily'))
      }
    ]
  }
]

export default routes