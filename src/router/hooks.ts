import { useHistory } from 'react-router'
import qs from 'qs'

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
    goPlaylistDetail (playlistId: number) {
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
      console.log(query)
      history.push(`/search${getQueryString(query)}`)
    }
  }
}