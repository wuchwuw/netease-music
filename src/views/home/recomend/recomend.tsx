import React, { useState, useEffect } from 'react'
import './recomend.less'
import api from 'API/index'
import Slider from 'COMPONENTS/slider/slider.tsx'
import { RouteChildrenProps } from 'react-router'
import { CSSTransition } from 'react-transition-group'
import { createBasePlaylist, PlaylistBaseClass } from 'UTIL/playlist'
import Song, { createSongList } from 'UTIL/song'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'

let loaded = false
let bannersCache = []
let playlistRecommendCache: PlaylistBaseClass[] = []
let privatecontentCache = []
let mvCache = []
let songCache: Song[] = []
let djCache = []

const HomeRecomend: React.SFC<RouteChildrenProps> = (props) => {
  const [banners, setBanners] = useState(bannersCache)
  const [playlistRecomend, setPlaylistRecomend] = useState(playlistRecommendCache)
  const [privatecontent, setPrivatecontent] = useState(privatecontentCache)
  const [mv, setMv] = useState(mvCache)
  const [song, setSong] = useState(songCache)
  const [dj, setDj] = useState(djCache)
  const [visible, setVisible] = useState(loaded)
  const { goArtistDetail } = usePageForword()
  useEffect(() => {
    if (!loaded) {
      getRecomend()
    }
  }, [])

  function getRecomend () {
    Promise.all([
      api.getBanner(),
      api.getPersonalized(),
      api.getPrivatecontent(),
      api.getNewMv(),
      api.getRecomendNewSong(),
      api.getRecomendDj()
    ]).then(res => {
      setBanners(bannersCache = res[0].data.banners)
      setPlaylistRecomend(playlistRecommendCache = createBasePlaylist(res[1].data.result.slice(0, 10)))
      setPrivatecontent(privatecontentCache = res[2].data.result)
      setMv(mvCache = res[3].data.data.slice(0, 4))
      setSong(songCache = createSongList(res[4].data.result.map((item: any) => item.song)))
      setDj(djCache = res[5].data.result)
      setVisible(loaded = true)
    })
  }

  function go (id: number) {
    props.history.push(`/playlist/${id}`)
  }

  return (
    <div className="container home-wrap">
      <CSSTransition in={!visible} timeout={500} unmountOnExit classNames="fade">
        <div className="home-loading">
          <i className="iconfont icon-default"></i>
          <p>正在生成个性化推荐...</p>
        </div>
      </CSSTransition>
      <div className="home-banner-wrap">
        <Slider images={banners}></Slider>
      </div>
      <div className="home-personalized">
        <div className="home-recommend-title">推荐歌单<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="commen-area-content">
          { playlistRecomend.map(item => (
            <div key={item.id} onClick={(e) => go(item.id)} className="commen-area-item commen-area-item-album">
              <div className="commen-area-img-wrap">
                <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{item.playCount_string}</div>
                <img className="commen-area-img" src={item.coverImgUrl+'?param=250y250'} alt=""/>
                <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
              </div>
              <div className="commen-area-text">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-music">
        <div className="home-recommend-title">最新音乐<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-music-content">
          { song.map((item, index) => (
            <div key={item.id} className="home-music-item">
              <div className="home-music-play-icon"><i className="iconfont icon-triangle-full"></i></div>
              <img className="home-music-img" src={item.album.picUrl+'?param=100y100'} alt=""/>
              <div className="home-music-num">{index < 9 ? '0' + (index + 1) : index + 1}</div>
              <div className="home-music-info">
                <div className="home-music-name text-overflow">{item.name}</div>
                <div className="home-music-artist text-overflow">{genArtists(item.artists, goArtistDetail, 'commen-link-666666')}</div>
              </div>
              { !!item.mv && <i className="iconfont icon-mv"></i> }
            </div>
          ))}
        </div>
      </div>
      <div className="home-mv">
        <div className="home-recommend-title">推荐MV<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-mv-content">
          { mv.map((item: any, index) => (
            <div key={index} className="home-mv-item">
              <div className="home-mv-playcount"><i className="iconfont icon-triangle"></i>{item.playCount > 100000 ? `${Math.round(item.playCount/10000)}万` : item.playCount}</div>
              <img className="home-mv-img" src={item.cover+'?param=170y95'} alt=""/>
              <div className="home-mv-text text-overflow">{item.name}</div>
              <div className="home-mv-artist text-overflow">{item.artistName}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-privatecontent">
        <div className="home-recommend-title">独家放送<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-privatecontent-content">
          { privatecontent.map((item: any, index) => (
            <div key={index} className="home-privatecontent-item">
              <img className="home-privatecontent-img" src={item.sPicUrl} alt=""/>
              <div className="home-privatecontent-text">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="home-dj">
        <div className="home-recommend-title">主播电台<i className="iconfont icon-arrow home-icon-arrow"></i></div>
        <div className="home-dj-content">
          { dj.map((item: any, index) => (
            <div key={index} className="home-dj-item">
              <img className="home-dj-img" src={item.picUrl+'?param=150y150'} alt=""/>
              <div className="home-dj-info">
                <div className="home-dj-name text-overflow">{item.name}</div>
                <div className="home-dj-artist text-overflow">{item.copywriter}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeRecomend