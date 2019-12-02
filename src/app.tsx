import * as React from 'react'
import LeftBar from './compontens/left-bar/left-bar'
import TopBar from './compontens/top-bar/top-bar'
import Player from './compontens/player/player'
import { Home } from './views/home'

export default class App extends React.Component {

  render () {
    return (
      <div className="appwrap">
        <div className="top"><TopBar /></div>
        <div className="main">
          <div className="main-left"><LeftBar></LeftBar></div>
          <div className="main-right">
            <Home></Home>
          </div>
        </div>
        <div className="bottom"><Player></Player></div>
      </div>
    )
  }
}