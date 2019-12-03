import React from 'react'
import './playlist.less'
// import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'

const Playlist: React.SFC = () => {
  return (
    <div className="container home-wrap">
      <div className="playlist-info-wrap">
        <img className="playlist-img" src="https://p1.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.jpg" />
        <div className="playlist-info">
          <div className="playlist-info-title">
            <span className="playlist-info-title-icon">歌单</span>
            我喜欢的音乐
          </div>
          <div className="playlist-info-user">
            <img className="playlist-info-user-avatar" src="https://p1.music.126.net/Fs0DjAvcAAyAZa1dgXzFfQ==/109951163571833739.jpg" alt=""/>
            <span className="playlist-info-user-name">wuchyuz</span>
            <span className="playlist-info-user-create">2015-2-2 创建</span>
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">全部播放</div>
            <div className="playlist-info-action-star">收藏</div>
          </div>
          <div className="playlist-info-num">歌曲数: 222  播放数: 2222</div>
        </div>
      </div>
    </div>
  )
}

export default Playlist