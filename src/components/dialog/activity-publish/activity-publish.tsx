import React, { useState, useEffect } from 'react'
import Dialog from 'COMPONENTS/dialog/dialog'
import './activity-publish.less'
import { UseDialogProps } from '..'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import Song, { createSongList, getSongList } from 'UTIL/song'
import { PlaylistBaseClass, createBasePlaylist } from 'UTIL/playlist'
import { ArtistBaseClass, createBaseArtistList } from 'UTIL/artist'
import { AlbumBaseClass, createBaseAlbumList } from 'UTIL/album'
import api from 'API/index'
import { useContainer } from 'COMPONENTS/container/container'
import Spin from 'COMPONENTS/spin/spin'
import { ActivityClassType, cretaeActicity } from 'UTIL/activity'
import notificationApi from 'COMPONENTS/notification'
import { Video } from 'UTIL/video'
import { MV } from 'UTIL/mv'

enum TabType {
  SONG = 'song',
  ARTIST = 'artist',
  ALBUM = 'album',
  PLAYLIST = 'playlist'
}

const SEARCH_TAB_NAME_MAP = {
  [TabType.SONG]: '单曲',
  [TabType.ARTIST]: '歌手',
  [TabType.ALBUM]: '专辑',
  [TabType.PLAYLIST]: '歌单'
}

interface SongResult {
  tab: TabType.SONG
  result: Song[]
}

interface ArtistResult {
  tab: TabType.ARTIST
  result: ArtistBaseClass[]
}

interface PlaylistResult {
  tab: TabType.PLAYLIST
  result: PlaylistBaseClass[]
}

interface AlbumResult {
  tab: TabType.ALBUM
  result: AlbumBaseClass[]
}

const SEARCH_TAB_PARAM_MAP = {
  [TabType.SONG]: 1,
  [TabType.ARTIST]: 100,
  [TabType.ALBUM]: 10,
  [TabType.PLAYLIST]: 1000
}

type SearchResult = SongResult | ArtistResult | AlbumResult| PlaylistResult
type ResultType = Song[] | ArtistBaseClass[] | AlbumBaseClass[] | PlaylistBaseClass[]

enum ShareType {
  SONG = 'song',
  ARTIST = 'artist',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
  MV = 'mv',
  VIDEO = 'video'
}

interface SongShare {
  tab: ShareType.SONG
  result: Song
}

interface ArtistShare  {
  tab: ShareType.ARTIST
  result: ArtistBaseClass
}

interface PlaylistShare  {
  tab: ShareType.PLAYLIST
  result: PlaylistBaseClass
}

interface AlbumShare  {
  tab: ShareType.ALBUM
  result: AlbumBaseClass
}

interface VideoShare  {
  tab: ShareType.VIDEO
  result: Video
}

interface MVShare  {
  tab: ShareType.MV
  result: MV
}

type SearchShare = SongShare | ArtistShare | PlaylistShare| AlbumShare | VideoShare | MVShare

export interface ActivityPublishProps {
  type: ShareType
  shareContent?: Song | ArtistBaseClass | PlaylistBaseClass | AlbumBaseClass
  shareSuccess?: (a: ActivityClassType) => void
}

const ActivityPublish: React.SFC<UseDialogProps & ActivityPublishProps> = (props) => {
  const [content, setContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [selected, setSelected] = useState(false)
  const [tab, setTab] = useState(TabType.SONG)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType>([])
  const { open, visiable } = useContainer([])
  const [share, setShare] = useState<SearchShare>({
    tab: props.type,
    result: props.shareContent as any
  })

  useEffect(() => {
    if (keywords === '') return
    setLoading(true)
    search()
  }, [keywords, tab])

  async function shareActivity () {
    try {
      let params: any = {
        msg: content
      }
      if (share.tab) {
        if (share.tab === 'video') {
          params.vid = share.result.vid
        } else {
          params.id = share.result.id
        }
        params.type = share.tab
      }
      const res = await api.share(params)
      props.shareSuccess && props.shareSuccess(cretaeActicity(res.data.event))
      notificationApi.success({ content: '分享到动态成功' })
      props.close()
    } catch (e) {}
  }

  async function search () {
    const params = {
      limit: 50,
      type: SEARCH_TAB_PARAM_MAP[tab],
      keywords,
      offset: 0
    }
    try {
      const res = await api.search(params)
      processResult(res)
      setLoading(false)
    } catch (e) {}
  }

  function fixResult (result: any) {
    if (!Array.isArray(result)) {
      return []
    } else {
      return result
    }
  }

  function processResult (res: any) {
    switch (tab) {
      case TabType.SONG:
        setResult(createSongList(fixResult(res.data.result.songs)))
        break
      case TabType.ARTIST:
        setResult(createBaseArtistList(fixResult(res.data.result.artists)))
        break
      case TabType.ALBUM:
        setResult(createBaseAlbumList(fixResult(res.data.result.albums)))
        break
      case TabType.PLAYLIST:
        setResult(createBasePlaylist(fixResult(res.data.result.playlists)))
        break
    }
  }

  function genSearchContent () {
    const res =  { tab, result } as SearchResult
    switch (res.tab) {
      case TabType.SONG:
        return (
          <ul className="activity-dialog-search-list">
            {
              res.result.map(song => (
                <li onClick={() => { setShareData(song) }} key={song.id} className="activity-dialog-search-item">
                  <span>{song.name}</span> - <span>{song.artistName}</span>
                </li>
              ))
            }
          </ul>
        )
      case TabType.ALBUM:
        return (
          <ul className="activity-dialog-search-list">
            {
              res.result.map(album => (
                <li onClick={() => { setShareData(album) }} key={album.id} className="activity-dialog-search-item">
                  {album.name} - {album.artistName}
                </li>
              ))
            }
          </ul>
        )
      case TabType.ARTIST:
        return (
          <ul className="activity-dialog-search-list">
            {
              res.result.map(artist => (
                <li onClick={() => { setShareData(artist) }} key={artist.id} className="activity-dialog-search-item">
                  {artist.name}
                </li>
              ))
            }
          </ul>
        )
        case TabType.PLAYLIST:
          return (
            <ul className="activity-dialog-search-list">
              {
                res.result.map(playlist => (
                  <li onClick={() => { setShareData(playlist) }} key={playlist.id} className="activity-dialog-search-item">
                    {playlist.name}
                  </li>
                ))
              }
            </ul>
          )
    }
  }

  function genShareContent () {
    if (!share.tab) {
      return (
        <div onClick={() => { setSelected(true) }} className="activity-dialog-add-content">
          <span className="activity-dialog-add-icon"><Icon fontSize={14} name="icon-neteastmusic"></Icon></span>
          <span className="activity-dialog-add-tip">给动态配上内容~</span>
        </div>
      )
    }

    function genContent (cover: string, text: string) {
      return (
        <div onClick={() => { setSelected(true) }} className="activity-dialog-add-content">
          <span className="activity-dialog-add-cover"><img src={cover} alt=""/></span>
          <span className="activity-dialog-add-tip">{text}</span>
        </div>
      )
    }
    switch (share.tab) {
      case ShareType.SONG:
        return genContent(share.result.album.picUrl, `${share.result.name}-${share.result.artistName}`)
      case ShareType.ALBUM:
        return genContent(share.result.picUrl, `${share.result.name}-${share.result.artistName}`)
      case ShareType.PLAYLIST:
        return genContent(share.result.coverImgUrl, share.result.name)
      case ShareType.ARTIST:
        return genContent(share.result.img1v1Url, share.result.name)
      case ShareType.MV:
        return genContent(share.result.cover, share.result.name)
      case ShareType.VIDEO:
        return genContent(share.result.coverUrl, share.result.title)
    }
  }

  async function setShareData (data: any) {
    setShare({ tab, result: data })
    if (tab === TabType.SONG) {
      const songs = await getSongList([data.id])
      songs.length && setShare({ tab, result: songs[0] })
    }
    setSelected(false)
  }

  return (
    <Dialog {...props} width={470}>
      <div className="dialog-title">分享</div>
      {
        !selected ? (
          <div>
            <div className="activity-dialog-textarea-wrap">
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value) }}
                className="activity-dialog-textarea"
                placeholder="一起聊聊音乐吧~"
                rows={8}
              >
              </textarea>
              <div className="activity-dialog-textarea-option">
                <Icon name="icon-face" fontSize={18}></Icon>
                <Icon name="icon-aite" fontSize={18}></Icon>
                <Icon name="icon-addtag" fontSize={18}></Icon>
                <span className="activity-dialog-textarea-reset">140</span>
              </div>
            </div>
            <>{genShareContent()}</>
            <div className="activity-dialog-button-wrap"><Button onClick={shareActivity} type="primary">分享</Button></div>
          </div>
        )
        :
        (
          <div className="activity-dialog-search">
            <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
              <span onClick={open} className="activity-dialog-selected">
                <span>{SEARCH_TAB_NAME_MAP[tab]}</span>
                <Icon fontSize={12} name="icon-triangle-full"></Icon>
                {
                  visiable && (
                    <ul className="activity-dialog-selected-content">
                      {
                        (Object.keys(SEARCH_TAB_NAME_MAP) as TabType[]).map(item => (
                          <li key={item} onClick={() => { setTab(item) }}>{SEARCH_TAB_NAME_MAP[item]}</li>
                        ))
                      }
                    </ul>
                  )
                }
              </span>
              <div className="activity-dialog-input-wrap">
                <Icon fontSize={13} name="icon-search"></Icon>
                <input
                  value={keywords}
                  onChange={(e) => { setKeywords(e.target.value) }}
                  placeholder="搜索分享的歌曲、歌手、专辑、歌单"
                  type="text"
                />
              </div>
            </div>
            <div className="activity-dialog-search-content">
              <Spin loading={loading} delay={0}>
                {genSearchContent()}
              </Spin>
            </div>
            <div onClick={() => { setSelected(false) }} style={{display: 'flex', justifyContent: 'center'}}><Button type="primary">返回</Button></div>
          </div>
        )
      }
    </Dialog>
  )
}

export default ActivityPublish