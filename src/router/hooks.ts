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
    }
  }
}