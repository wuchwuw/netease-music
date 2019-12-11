import React, { useState, useEffect } from 'react'
import './album.less'
import api from 'API/index'

const HomeAlbum: React.SFC = () => {
  const [ top, setTop ] = useState([])
  useEffect(() => {
    getTopList()
  }, [])

  async function getTopList () {
    try {
      const res = await api.getTopList()
      setTop(res.data.playlists)
    } catch (e) {}
  }
  return (
    <div className="container home-wrap">
      <div className="home-album-hot" >
        <div 
          className="home-album-hot-bg" 
          style={{ 
            background: "url('https://p1.music.126.net/1Nx7mLel4YoVjEYpPhqBYw==/109951164503487070.jpg')",
            backgroundPosition: 'center',
            filter: 'blur(40px)'
          }}
        ></div>
        <img src="https://p1.music.126.net/1Nx7mLel4YoVjEYpPhqBYw==/109951164503487070.jpg" className="home-album-hot-img" />
        <div className="home-album-hot-info">
          <div className="home-album-hot-btn">精品歌单</div>
          <div className="home-album-hot-name">华语电影台词对白 | 年年不忘</div>
          <div className="home-album-hot-des">华语电影台词对白</div>
        </div>        
      </div>
      <div className="home-album-filter">
        <div className="home-album-filter-btn">全部歌单<i className="iconfont icon-arrow"></i></div>
        <div className="home-album-filter">
          <span>华语</span>
          <span>流行</span>
          <span>华语</span>
          <span>华语</span>
        </div>
      </div>
      <div className="home-album-content">
        { top.map((item: any, index) => (
            <div key={index} className="home-album-item">
              <img className="home-album-img" src={item.coverImgUrl} alt=""/>
              <div className="home-album-text">{item.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default HomeAlbum