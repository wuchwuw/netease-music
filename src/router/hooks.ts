import { useHistory } from 'react-router'
import qs from 'qs'
import { PlaylistClass } from 'UTIL/playlist'
import { setPlaylistCacheOnce } from 'UTIL/playlist-cache'
import * as H from 'history'

export function usePageForword () {
  const history = useHistory()

  function getQueryString (query: any) {
    const queryString = qs.stringify(query)
    return queryString ? `?${queryString}` : ''
  }

  return {
    goAlbumDetail (albumId: number) {
      history.push(`/album/${albumId}`)
    },
    goArtistDetail (artistId: number) {
      history.push(`/artist/${artistId}`)
    },
    goPlaylistDetail (playlistId: number, playlist?: PlaylistClass) {
      playlist && setPlaylistCacheOnce(playlist)
      history.push(`/playlist/${playlistId}`)
    },
    goUserDetail (userId: number) {
      history.push(`/user/${userId}`)
    },
    goNewSong () {
      history.push('/home/new')
    },
    goMVDiscover () {
      history.push('/video/mv')
    },
    goSearch (query: any) {
      history.push(`/search${getQueryString(query)}`)
    },
    goPlaylistDiscover (query: { cate: string }) {
      history.push(`/home/playlist${getQueryString(query)}`)
    },
    goVideoDetail (videoId: string) {
      history.push(`/v/${videoId}`)
    },
    goMVDetail (mvId: number | string) {
      history.push(`/m/${mvId}`)
    },
    goPlaylistEdit (playlistId: number) {
      history.push(`/playlist-edit/${playlistId}`)
    },
    back () {
      history.goBack()
    },
    goDaily () {
      history.push('/daily')
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