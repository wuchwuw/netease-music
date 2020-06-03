import { useHistory } from 'react-router'
import qs from 'qs'
import { PlaylistClass } from 'UTIL/playlist'
import { setPlaylistDefault } from 'UTIL/playlist-cache'

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
      playlist && setPlaylistDefault(playlist)
      history.push(`/playlist/${playlistId}`)
    },
    goUserDetail (userId: number) {
      history.push(`/user/${userId}`)
    },
    goNewSong () {
      history.push('/home/new')
    },
    goAllPlaylist () {
      history.push('/home/playlist')
    },
    goMVDiscover () {
      history.push('/video/mv')
    },
    goSearch (query: any) {
      history.push(`/search${getQueryString(query)}`)
    },
    goPlaylistDiscover (query: { tab: string}) {
      history.push(`/home/playlist${getQueryString(query)}`)
    }
  }
}