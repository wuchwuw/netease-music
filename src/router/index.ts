import App from '../app'
import HomeRecomend from '../views/home/recomend/recomend'
import HomeAlbum from '../views/home/album/album'
import Home from '../views/home/index'
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
      }
    ]
  }
]

export default routes