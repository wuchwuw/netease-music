import { useHistory } from 'react-router'
import qs from 'qs'
import { PlaylistClass } from 'UTIL/playlist'
import { setPlaylistCacheOnce } from 'UTIL/playlist-cache'
import * as H from 'history'
import { PLAYER_FULL_SCREEN } from 'STORE/player/types'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import { usePlayerController } from 'UTIL/player-controller'

export function usePageForword () {
  const history = useHistory()
  const dispatch = useDispatch()
  const fullScreen = useSelector((state: RootState) => state.player.fullScreen)
  const { playing, togglePlay } = usePlayerController()

  function getQueryString (query: any) {
    const queryString = qs.stringify(query)
    return queryString ? `?${queryString}` : ''
  }

  function goPage (path: string) {
    if (fullScreen) {
      dispatch({ type: PLAYER_FULL_SCREEN, fullScreen: false })
    }
    history.push(path)
  }

  return {
    goPage,
    goAlbumDetail (albumId: number) {
      if (!albumId) return
      goPage(`/album/${albumId}`)
    },
    goArtistDetail (artistId: number) {
      goPage(`/artist/${artistId}`)
    },
    goPlaylistDetail (playlistId: number, playlist?: PlaylistClass) {
      playlist && setPlaylistCacheOnce(playlist)
      goPage(`/playlist/${playlistId}`)
    },
    goUserDetail (userId: number) {
      goPage(`/user/${userId}`)
    },
    goNewSong () {
      goPage('/home/new')
    },
    goMVDiscover () {
      goPage('/video/mv')
    },
    goSearch (query: any) {
      goPage(`/search${getQueryString(query)}`)
    },
    goPlaylistDiscover (query: { cate: string }) {
      goPage(`/home/playlist${getQueryString(query)}`)
    },
    goVideoDetail (videoId: string) {
      if (playing) {
        togglePlay()
      }
      goPage(`/v/${videoId}`)
    },
    goMVDetail (mvId: number | string) {
      if (playing) {
        togglePlay()
      }
      goPage(`/m/${mvId}`)
    },
    goPlaylistEdit (playlistId: number) {
      goPage(`/playlist-edit/${playlistId}`)
    },
    back () {
      history.goBack()
    },
    goDaily () {
      goPage('/daily')
    },
    goUserEdit () {
      goPage('/user-edit')
    },
    goUserFollow (userId: number, query: { username: string }) {
      goPage(`/follows/${userId}${getQueryString(query)}`)
    },
    goUserFollowed (userId: number, query: { username: string }) {
      goPage(`/followeds/${userId}${getQueryString(query)}`)
    },
    goUserEvent (userId: number, query: { username: string }) {
      goPage(`/event/${userId}${getQueryString(query)}`)
    },
    goFM () {
      goPage('/fm')
    },
    goAllMV (query: any) {
      goPage(`/allmv${getQueryString(query)}`)
    }
  }
}

export function getQueryStringValue (): any {
  const queryString = window.location.search
  const values = qs.parse(queryString ? queryString.substring(1) : queryString)
  return values
}

export function setQueryStringValue (value: any, history: H.History) {
  const queryString = window.location.search
  const values = qs.parse(queryString ? queryString.substring(1) : queryString)
  const newSearch = qs.stringify(Object.assign({}, values, value))
  history.push(`${location.pathname}?${newSearch}`)
}