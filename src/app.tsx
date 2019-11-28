import * as React from 'react'
import LeftBar from './compontens/left-bar/left-bar'
import TopBar from './compontens/top-bar/top-bar'
import Player from './compontens/player/player'

export default class App extends React.Component {
  
  render () {
    return (
      <div className="appwrap">
        <div className="top"></div>
        <div className="main">
          <div className="main-left"><LeftBar></LeftBar></div>
          <div className="main-right"></div>
        </div>
        <div className="bottom"></div>
      </div>
    )
  }
}