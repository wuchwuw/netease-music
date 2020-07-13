import React, { useState, useEffect } from 'react'
import './recomend.less'
import api from 'API/index'
import Slider, { ImageItem } from 'COMPONENTS/slider/slider.tsx'
import { CSSTransition } from 'react-transition-group'
import { PlaylistClass, createPlaylistList } from 'UTIL/playlist'
import Song, { createSongList } from 'UTIL/song'
import { MV, createMVList, createPrivateContentMVList } from 'UTIL/mv'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import { padZero } from 'UTIL/util'
import { usePlayerController } from 'UTIL/player-controller'
import Icon from 'COMPONENTS/icon/icon'

let loaded = false
let bannersCache: ImageItem[] = []
let playlistRecommendCache: PlaylistClass[] = []
let privatecontentCache: MV[] = []
let mvCache: MV[] = []
let songCache: Song[] = []
// let djCache: any = []

const HomeRecomend = () => {
  const [banners, setBanners] = useState<ImageItem[]>(bannersCache)
  const [playlistRecomend, setPlaylistRecomend] = useState(playlistRecommendCache)
  const [privatecontent, setPrivatecontent] = useState(privatecontentCache)
  const [mv, setMv] = useState(mvCache)
  const [song, setSong] = useState(songCache)
  // const [dj, setDj] = useState(djCache)
  const [visible, setVisible] = useState(loaded)
  const { goArtistDetail, goPlaylistDetail, goDaily, goMVDetail, goNewSong, goPlaylistDiscover, goMVDiscover } = usePageForword()
  const { currentSong, start } = usePlayerController()

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
      api.getRecommendwMV(),
      api.getRecomendNewSong()
      // api.getRecomendDj()
    ]).then(res => {
      setBanners(bannersCache = res[0].data.banners)
      setPlaylistRecomend(playlistRecommendCache = createPlaylistList(res[1].data.result.slice(0, 9)))
      setPrivatecontent(privatecontentCache = createPrivateContentMVList(res[2].data.result))
      setMv(mvCache = createMVList(res[3].data.result))
      setSong(songCache = createSongList(res[4].data.result.map((item: any) => item.song)))
      // setDj(djCache = res[5].data.result)
      setVisible(loaded = true)
    })
  }

  return (
    <div className="container" styleName="home-wrap">
      <CSSTransition in={!visible} timeout={500} unmountOnExit classNames="fade">
        <div styleName="home-loading">
          <Icon className="icon-color-main" fontSize={100} name="icon-default"></Icon>
          <p>正在生成个性化推荐...</p>
        </div>
      </CSSTransition>
      <div styleName="home-banner-wrap">
        <Slider images={banners}></Slider>
      </div>
      <div styleName="home-personalized">
        <span onClick={() => { goPlaylistDiscover({ cate: '全部'}) }} styleName="home-recommend-title">推荐歌单<Icon style={{fontWeight: 600}} name="icon-arrow-right"></Icon></span>
        <div className="commen-area-content">
          <div className="commen-area-item">
            <div styleName="recomend-daily-icon" onClick={ goDaily }>
              <div styleName="recomend-daily-day">星期{(['日', '一', '二', '三', '四', '五', '六'])[(new Date).getDay()]}</div>
              <div styleName="recomend-daily-date">{(new Date).getDate()}</div>
            </div>
            <div className="commen-area-text line-more" onClick={ goDaily }>每日歌曲推荐</div>
          </div>
          { playlistRecomend.map(playlist => (
            <div onClick={() => goPlaylistDetail(playlist.id, playlist) } className={`commen-area-item commen-area-item-playlist-130`}>
              <div className="commen-area-img-wrap">
                <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{playlist.playCount_string}</div>
                <img className="commen-area-img" src={playlist.coverImgUrl+'?param=250y250'} alt=""/>
                <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
              </div>
              <div className="commen-area-text line-more">{playlist.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span onClick={ goNewSong } styleName="home-recommend-title">最新音乐<Icon style={{fontWeight: 600}} name="icon-arrow-right"></Icon></span>
        <div styleName="home-music-content">
          { song.map((item, index) => (
            <div onDoubleClick={() => { start({ id: 'home-index', name: '发现页' }, item, song) }} key={item.id} styleName="home-music-item">
              <div styleName="home-music-play-icon"><Icon name="icon-triangle-full"></Icon></div>
              <img styleName="home-music-img" src={item.album.picUrl+'?param=100y100'} alt=""/>
              <div styleName="home-music-num">{padZero(index + 1)}</div>
              <div styleName="home-music-info">
                <div styleName="home-music-name">
                  <span className="text-overflow">{item.name}{item.alia_string}</span>
                  {item.isHighQuality && <span className="icon-music-highquality">SQ</span>}
                </div>
                <div styleName="home-music-artist" className="text-overflow">{genArtists(item.artists, goArtistDetail, 'commen-link-666666')}</div>
              </div>
              { !!item.mv && <Icon onClick={() => { goMVDetail(item.mv) }} name="icon-mv" className="icon-color-main hover"></Icon> }
            </div>
          ))}
        </div>
      </div>
      <div>
        <span onClick={ goMVDiscover } styleName="home-recommend-title">推荐MV<Icon style={{fontWeight: 600}} name="icon-arrow-right"></Icon></span>
        <div className="commen-area-content">
          { mv.map(item => (
            <div key={item.id} className="commen-area-item commen-area-item-170x95">
              <div onClick={() => { goMVDetail(item.id) }} className="commen-area-img-wrap">
                <div className="commen-area-playcount"><Icon name="icon-triangle"></Icon>{item.playCount_format}</div>
                <img className="commen-area-img" src={item.cover+'?param=500y282'} alt=""/>
                <div className="commen-area-play-icon"><Icon name="icon-triangle-full"></Icon></div>
              </div>
              <div onClick={() => { goMVDetail(item.id) }} className="commen-area-text">{item.name}</div>
              <div className="commen-area-artist">{genArtists(item.artists, goArtistDetail, 'commen-link-666666')}</div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <span onClick={ goMVDiscover } styleName="home-recommend-title">独家放送<Icon style={{fontWeight: 600}} name="icon-arrow-right"></Icon></span>
        <div className="commen-area-content">
          { privatecontent.map(item => (
            <div key={item.id} className="commen-area-item commen-area-item-170x95">
              <div onClick={() => { goMVDetail(item.id) }} className="commen-area-img-wrap">
                <img className="commen-area-img" src={item.cover+'?param=500y282'} alt=""/>
                <div className="commen-area-play-icon"><Icon name="icon-triangle"></Icon></div>
              </div>
              <div onClick={() => { goMVDetail(item.id) }} className="commen-area-text line-more">{item.name}</div>
            </div>
          ))}
        </div>
      </div>
      {/* <div className="home-dj">
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
      </div> */}
    </div>
  )
}

export default HomeRecomend