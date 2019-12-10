import React, { useState, useEffect } from 'react'
// import { Carousel } from 'antd'
import './recomend.less'
import api from 'API'
import Slider from 'COMPONENTS/slider/slider.tsx'

const HomeRecomend: React.SFC = (props) => {
  const [ banners, setBanners ] = useState([])
  const [ personalized, setPersonalized ] = useState([])
  const [ privatecontent, setPrivatecontent ] = useState([])
  const [ mv, setMv ] = useState([])
  const [ song, setSong ] = useState([])
  useEffect(() => {
    getBanners()
    getPersonalized()
    getPrivatecontent()
    getNewMv()
    getNewSong()
  }, [])

  async function getBanners () {
    try {
      const res = await api.getBanner()
      setBanners(res.data.banners)
    } catch (e) {}
  }
  async function getPersonalized () {
    try {
      const res = await api.getPersonalized()
      setPersonalized(res.data.result.slice(0, 10))
    } catch (e) {}
  }
  async function getPrivatecontent () {
    try {
      const res = await api.getPrivatecontent()
      setPrivatecontent(res.data.result)
    } catch (e) {}
  }
  async function getNewMv () {
    try {
      const res = await api.getNewMv()
      setMv(res.data.data.slice(0, 4))
    } catch (e) {}
  }
  async function getNewSong () {
    try {
      const res = await api.getNewSong()
      setSong(res.data.result)
    } catch (e) {}
  }
  // function getArtistName (artists: Object[]) {
  // }
  function go (id) {
    props.history.push(`/playlist/${id}`)
  }

  return (
    <div className="container home-wrap">
      <div className="home-banner-wrap">
        <Slider images={banners}></Slider>
      </div>
      <div className="home-personalized">
        <div className="home-recommend-title">推荐歌单<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-personalized-content">
          { personalized.map((item: any, index) => (
            <div key={index} onClick={(e) => go(item.id)} className="home-personalized-item">
              <img className="home-personalized-img" src={item.picUrl+'?param=133y133'} alt=""/>
              <div className="home-personalized-text">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-privatecontent">
        <div className="home-recommend-title">独家放送<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-privatecontent-content">
          { privatecontent.map((item: any, index) => (
            <div key={index} className="home-privatecontent-item">
              <img className="home-privatecontent-img" src={item.picUrl+'?param=170y95'} alt=""/>
              <div className="home-privatecontent-text">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-music">
        <div className="home-recommend-title">最新音乐<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-music-content">
          { song.map((item: any, index) => (
            <div key={index} className="home-music-item">
              <img className="home-music-img" src={item.song.album.picUrl+'?param=60y60'} alt=""/>
              <div className="home-music-num">{'0' + (index + 1)}</div>
              <div className="home-music-info">
                <div className="home-music-name text-overflow">{item.name}</div>
                <div className="home-music-artist text-overflow">{item.song.artists[0].name}</div>
              </div>
              { !!item.song.mvid && <i className="iconfont icon-mv"></i> }
            </div>
          ))}
        </div>
      </div>
      <div className="home-mv">
        <div className="home-recommend-title">推荐MV<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-mv-content">
          { mv.map((item: any, index) => (
            <div key={index} className="home-mv-item">
              <img className="home-mv-img" src={item.cover+'?param=170y95'} alt=""/>
              <div className="home-mv-text text-overflow">{item.name}</div>
              <div className="home-mv-artist text-overflow">{item.artistName}</div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="home-mv">
        <div className="home-recommend-title">主播电台</div>
      </div> */}
    </div>
  )
}

export default HomeRecomend 