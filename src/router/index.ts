import App from '../app'
import HomeRecomend from 'VIEWS/home/recomend/recomend'
import HomeAlbum from 'VIEWS/home/playlist/playlist'
import HomeToplist from 'VIEWS/home/toplist/toplist'
import HomeArtist from 'VIEWS/home/artist/artist'
import HomeNew from 'VIEWS/home/new/new'
import HomeRadio from 'VIEWS/home/radio/radio'
import Home from 'VIEWS/home/index'
import Playlist from 'VIEWS/playlist/playlist'
import Search from 'VIEWS/search/search'
import { RouteConfig } from 'react-router-config'
import { createRedirect } from './redirect'
import Video from 'VIEWS/video/video/video'
import VideoContainer from 'VIEWS/video/index'
import MvRecomend from 'VIEWS/video/mv/mv'
import Friends from 'VIEWS/friends/friends'
import FM from 'VIEWS/fm/fm'
import User from 'VIEWS/user/user'

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
        path: '/fm',
        component: FM
      },
      {
        path: '/user/:id',
        component: User
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
            path: '/home/album',
            component: HomeAlbum
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
      }
    ]
  }
]

export default routes