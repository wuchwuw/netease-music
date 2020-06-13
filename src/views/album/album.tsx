import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Album as AlbumClass } from 'UTIL/album'
import api from 'API/index'
import MusicList from 'COMPONENTS/music-list/music-list'
import Comment from 'COMPONENTS/comment/comment'
import { useAlbumContextMenu } from 'UTIL/menu'
import Song from 'UTIL/song'
import { usePlayerController } from 'UTIL/player-controller'
import './album.less'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'

enum AlbumTab {
  SONG = 'SONG',
  COMMENT = 'COMMENT',
  DESC = 'DESC'
}

const AlbumTabMap = {
  'SONG': '歌曲列表',
  'COMMENT': '评论',
  'DESC': '专辑详情'
}

const Album = () => {
  const { id } = useParams()
  const albumId = Number(id)
  const [ tab, setTab ] = useState(AlbumTab.SONG) // list comment des
  const [ album, setAlbum ] = useState<AlbumClass>(new AlbumClass({}))
  const { getAlubmMenu } = useAlbumContextMenu()
  const { start, nextPlayPlaylist } = usePlayerController()
  const { goArtistDetail } = usePageForword()

  useEffect(() => {
    getAlbum()
  }, [albumId])

  async function getAlbum () {
    try {
      const res = await Promise.all([api.getAlbumContent({ id: albumId }), api.getAlbumDynamic({ id: albumId })])
      const resInfo = res[1].data
      setAlbum(new AlbumClass({ 
        ...res[0].data.album, 
        songs: res[0].data.songs,
        info: {
          shareCount: resInfo.shareCount,
          commentCount: resInfo.commentCount,
          subCount: resInfo.subCount,
          isSub: resInfo.isSub
        }
      }))
    } catch (e) {}
  }

  function getMenu (song: Song) {
    return getAlubmMenu({ id: `album-${album.id}`, name: album.name }, song, album)
  }

  function musiclistStart (song: Song) {
    start({ id: `album-${album.id}`, name: album.name }, song, album.songs)
  }

  function genTabComponent () {
    switch (tab) {
      case AlbumTab.SONG:
        return <MusicList getMenu={getMenu} start={musiclistStart} list={album.songs}></MusicList>
      case AlbumTab.COMMENT:
        return <div style={{ padding: '30px'}}><Comment type="album" id={albumId}></Comment></div>
      case AlbumTab.DESC:
        return (
          <>
            {
              album.description ?
              <div>
                <pre>{album.description}</pre>
              </div>
              :
              <div style={{textAlign: 'center'}}>暂无详情</div>              
            }    
          </>
        )
      default:
        return <></>
    }
  }
  return (
    <div className="playlist-wrap">
      <div className="playlist-info-wrap">
        <div className="playlist-img" style={{backgroundImage: `url(${album.picUrl + '?param=200y200'})`}}></div>
        <div className="playlist-info">
          <div className="playlist-info-title">
            <span className="playlist-info-title-icon">专辑</span>
            {album.name}
          </div>
          <div className="playlist-info-action">
            <div className="playlist-info-action-playall">
              <div onClick={() => { album.songs.length && musiclistStart(album.songs[0]) }}><i className="iconfont icon-play" ></i>播放全部</div>
              <i onClick={() => { nextPlayPlaylist({ id: `album-${album.id}`, name: album.name }, album.songs) }} className="iconfont icon-add"></i>
            </div>
            <div className="playlist-info-action-star"><i className="iconfont icon-star"></i>{album.info.isSub ? '已收藏' : '收藏'}({album.info.subCount})</div>
            <div className="playlist-info-action-star"><i className="iconfont icon-share"></i>分享({album.info.shareCount})</div>
          </div>
          <div className="playlist-info-num">
            <div>歌手: { genArtists(album.artists, goArtistDetail, 'commen-link-blue') }</div>
            <div>时间: {album.publishTimeFormat}</div>
          </div>
        </div>
      </div>
      <div className="playlist-tab-wrap">
        <div className="playlist-tab">
          {
            (Object.keys(AlbumTabMap) as AlbumTab[]).map((item => (
              <span onClick={() => setTab(item)} className={tab === item ? 'active' : ''}>
                {AlbumTabMap[item]}{item === AlbumTab.COMMENT ? `(${album.info.commentCount})` : ''}
              </span>
            )))
          }
        </div>
      </div>
      {genTabComponent()}
    </div>
  )
}

export default Album