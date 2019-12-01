import React, { useState, useEffect } from 'react'
import { Carousel, Button } from 'antd'
import './index.less'
import api from '../../api'



export function Home () {
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

  return (
    <div className="container home-wrap">
      <div className="home-banner-wrap">
        <Carousel autoplay>
          {banners.map((item: any, index: any) => (
            <img className="home-banner-img" key={index} src={item.imageUrl} alt=""/>
          ))}
        </Carousel>
      </div>
      <div className="home-personalized">
        <div className="home-recommend-title">推荐歌单</div>
        <div className="home-personalized-content">
          { personalized.map((item: any, index) => (
            <div key={index} className="home-personalized-item">
              <img className="home-personalized-img" src={item.picUrl} alt=""/>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-privatecontent">
        <div className="home-recommend-title">独家放送</div>
        <div className="home-privatecontent-content">
          { privatecontent.map((item: any, index) => (
            <div key={index} className="home-privatecontent-item">
              <img className="home-privatecontent-img" src={item.picUrl} alt=""/>
              <div>{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-music">
        <div className="home-recommend-title">最新音乐</div>
        <div className="home-music-content">
          { song.map((item: any, index) => (
            <div key={index} className="home-music-item">
              <img className="home-music-img" src={item.song.album.picUrl} alt=""/>
              <div className="home-music-num">{'0' + (index + 1)}</div>
              <div className="home-music-info">
                <div className="home-music-name">{item.name}</div>
                <div className="home-music-artist">{item.song.artists[0].name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-mv">
        <div className="home-recommend-title">推荐MV</div>
        <div className="home-mv-content">
          { mv.map((item: any, index) => (
            <div key={index} className="home-mv-item">
              <img className="home-mv-img" src={item.cover} alt=""/>
              <div>{item.name}</div>
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