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

export enum ShareType {
  SONG = 'song',
  ARTIST = 'artist',
  ALBUM = 'album',
  PLAYLIST = 'playlist',
  MV = 'mv',
  VIDEO = 'video',
  DETAULT = ''
}

interface DefaultShare {
  type: ShareType.DETAULT
  content?: any
}

interface SongShare {
  type: ShareType.SONG
  content: Song
}

interface ArtistShare  {
  type: ShareType.ARTIST
  content: ArtistBaseClass
}

interface PlaylistShare  {
  type: ShareType.PLAYLIST
  content: PlaylistBaseClass
}

interface AlbumShare  {
  type: ShareType.ALBUM
  content: AlbumBaseClass
}

interface VideoShare  {
  type: ShareType.VIDEO
  content: Video
}

interface MVShare  {
  type: ShareType.MV
  content: MV
}

export type SearchShare = SongShare | ArtistShare | PlaylistShare| AlbumShare | VideoShare | MVShare | DefaultShare

export interface ActivityPublishProps {
  share: SearchShare
  shareSuccess?: (a: ActivityClassType) => void
}

const ActivityPublish: React.SFC<UseDialogProps & ActivityPublishProps> = (props) => {
  const [content, setContent] = useState('')
  const [keywords, setKeywords] = useState('')
  const [selected, setSelected] = useState(false)
  const [tab, setTab] = useState(TabType.SONG)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType>([])
  const { open, visible } = useContainer([])
  const [share, setShare] = useState<SearchShare>(props.share)

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
      if (share.type) {
        if (share.type === ShareType.VIDEO) {
          params.vid = share.content.vid
        } else {
          params.id = share.content.id
        }
        params.type = share.type
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
          <ul styleName="activity-dialog-search-list">
            {
              res.result.map(song => (
                <li onClick={() => { setShareData({ type: ShareType.SONG, content: song }) }} key={song.id} styleName="activity-dialog-search-item">
                  <span>{song.name}</span> - <span>{song.artistName}</span>
                </li>
              ))
            }
          </ul>
        )
      case TabType.ALBUM:
        return (
          <ul styleName="activity-dialog-search-list">
            {
              res.result.map(album => (
                <li onClick={() => { setShareData({ type: ShareType.ALBUM, content: album }) }} key={album.id} styleName="activity-dialog-search-item">
                  {album.name} - {album.artistName}
                </li>
              ))
            }
          </ul>
        )
      case TabType.ARTIST:
        return (
          <ul styleName="activity-dialog-search-list">
            {
              res.result.map(artist => (
                <li onClick={() => { setShareData({ type: ShareType.ARTIST, content: artist }) }} key={artist.id} styleName="activity-dialog-search-item">
                  {artist.name}
                </li>
              ))
            }
          </ul>
        )
        case TabType.PLAYLIST:
          return (
            <ul styleName="activity-dialog-search-list">
              {
                res.result.map(playlist => (
                  <li onClick={() => { setShareData({ type: ShareType.PLAYLIST, content: playlist }) }} key={playlist.id} styleName="activity-dialog-search-item">
                    {playlist.name}
                  </li>
                ))
              }
            </ul>
          )
    }
  }

  function genShareContent () {
    if (!share.type) {
      return (
        <div onClick={() => { setSelected(true) }} styleName="activity-dialog-add-content">
          <span styleName="activity-dialog-add-icon"><Icon fontSize={14} name="icon-neteastmusic"></Icon></span>
          <span styleName="activity-dialog-add-tip">给动态配上内容~</span>
        </div>
      )
    }

    function genContent (cover: string, text: string) {
      return (
        <div onClick={() => { setSelected(true) }} styleName="activity-dialog-add-content">
          <span styleName="activity-dialog-add-cover"><img src={cover} alt=""/></span>
          <span styleName="activity-dialog-add-tip">{text}</span>
        </div>
      )
    }
    switch (share.type) {
      case ShareType.SONG:
        return genContent(share.content.album.picUrl, `${share.content.name}-${share.content.artistName}`)
      case ShareType.ALBUM:
        return genContent(share.content.picUrl, `${share.content.name}-${share.content.artistName}`)
      case ShareType.PLAYLIST:
        return genContent(share.content.coverImgUrl, share.content.name)
      case ShareType.ARTIST:
        return genContent(share.content.img1v1Url, share.content.name)
      case ShareType.MV:
        return genContent(share.content.cover, share.content.name)
      case ShareType.VIDEO:
        return genContent(share.content.coverUrl, share.content.title)
    }
  }

  async function setShareData (data: SearchShare) {
    setShare(data)
    if (tab === TabType.SONG) {
      const songs = await getSongList([data.content.song.id])
      songs.length && setShare({ type: ShareType.SONG, content: songs[0] })
    }
    setSelected(false)
  }

  return (
    <Dialog {...props} width={470}>
      <div className="dialog-title">分享</div>
      {
        !selected ? (
          <div>
            <div styleName="activity-dialog-textarea-wrap">
              <textarea
                value={content}
                onChange={(e) => { setContent(e.target.value) }}
                styleName="activity-dialog-textarea"
                placeholder="一起聊聊音乐吧~"
                rows={8}
              >
              </textarea>
              <div styleName="activity-dialog-textarea-option">
                <Icon name="icon-face" fontSize={18}></Icon>
                <Icon name="icon-aite" fontSize={18}></Icon>
                <Icon name="icon-addtag" fontSize={18}></Icon>
                <span styleName="activity-dialog-textarea-reset">140</span>
              </div>
            </div>
            <>{genShareContent()}</>
            <div styleName="activity-dialog-button-wrap"><Button onClick={shareActivity} type="primary">分享</Button></div>
          </div>
        )
        :
        (
          <div styleName="activity-dialog-search">
            <div style={{display: 'flex', alignItems: 'center', marginTop: '10px'}}>
              <span onClick={open} styleName="activity-dialog-selected">
                <span>{SEARCH_TAB_NAME_MAP[tab]}</span>
                <Icon fontSize={12} name="icon-triangle-full"></Icon>
                {
                  visible && (
                    <ul styleName="activity-dialog-selected-content">
                      {
                        (Object.keys(SEARCH_TAB_NAME_MAP) as TabType[]).map(item => (
                          <li key={item} onClick={() => { setTab(item) }}>{SEARCH_TAB_NAME_MAP[item]}</li>
                        ))
                      }
                    </ul>
                  )
                }
              </span>
              <div styleName="activity-dialog-input-wrap">
                <Icon fontSize={13} name="icon-search"></Icon>
                <input
                  value={keywords}
                  onChange={(e) => { setKeywords(e.target.value) }}
                  placeholder="搜索分享的歌曲、歌手、专辑、歌单"
                  type="text"
                />
              </div>
            </div>
            <div styleName="activity-dialog-search-content">
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