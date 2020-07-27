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
import notificationApi from 'COMPONENTS/notification'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import { createShareDialog, ShareType } from 'COMPONENTS/dialog/create'

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

let albumCache: any = {}

const Album = () => {
  const { id } = useParams()
  const albumId = Number(id)
  const [ tab, setTab ] = useState(AlbumTab.SONG) // list comment des
  const [ album, setAlbum ] = useState<AlbumClass>(new AlbumClass({}))
  const { getAlubmMenu } = useAlbumContextMenu()
  const { start, nextPlayPlaylist } = usePlayerController()
  const { goArtistDetail } = usePageForword()
  const openShareDialog = createShareDialog()

  useEffect(() => {
    getAlbum()
  }, [albumId])

  async function getAlbum () {
    try {
      const res = await Promise.all([api.getAlbumContent({ id: albumId }), api.getAlbumDynamic({ id: albumId })])
      const resInfo = res[1].data
      setAlbum(new AlbumClass(albumCache = {
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

  async function subAlbum () {
    const t = album.info.isSub ? 2 : 1
    try {
      await api.subAlbum({ t, id: album.id })
      notificationApi.success({
        content: album.info.isSub ? '取消收藏专辑' : '收藏专辑成功'
      })
      albumCache.info.isSub = !album.info.isSub
      setAlbum(new AlbumClass(albumCache))
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
    <div styleName="playlist-wrap">
      <div styleName="playlist-info-wrap">
        <div styleName="playlist-img" style={{backgroundImage: `url(${album.picUrl + '?param=200y200'})`}}></div>
        <div styleName="playlist-info">
          <div styleName="playlist-info-title">
            <span styleName="playlist-info-title-icon">专辑</span>
            {album.name}
          </div>
          <div styleName="playlist-info-action">
            <div styleName="playlist-info-action-playall">
              <div onClick={() => { album.songs.length && musiclistStart(album.songs[0]) }}><i className="iconfont icon-play" ></i>播放全部</div>
              <i onClick={() => { nextPlayPlaylist({ id: `album-${album.id}`, name: album.name }, album.songs) }} className="iconfont icon-add"></i>
            </div>
            <Button onClick={ subAlbum } icon={<Icon name="icon-star"></Icon>}>{album.info.isSub ? '已收藏' : '收藏'}({album.info.subCount})</Button>
            <Button onClick={() => { openShareDialog({ share: { type: ShareType.ALBUM, content: album } }) }} icon={<Icon name="icon-share"></Icon>}>分享({album.info.shareCount})</Button>
          </div>
          <div styleName="playlist-info-num">
            <div>歌手: { genArtists(album.artists, goArtistDetail, 'commen-link-blue') }</div>
            <div>时间: {album.publishTimeFormat}</div>
          </div>
        </div>
      </div>
      <div styleName="playlist-tab-wrap">
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