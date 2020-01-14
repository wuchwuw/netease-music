import App from '../app'
import HomeRecomend from 'VIEWS/home/recomend/recomend'
import HomeAlbum from 'VIEWS/home/playlist/playlist'
import Home from 'VIEWS/home/index'
import Playlist from 'VIEWS/playlist/playlist'
import Search from 'VIEWS/search/search'
import { RouteConfig } from 'react-router-config'
import { createRedirect } from './redirect'

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
        path: '/playlist/:id',
        component: Playlist,
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
          }
        ]
      },
      {
        path: '/search',
        component: Search
      }
    ]
  }
]

export default routes