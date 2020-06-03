import React, { useEffect, useState } from 'react'
import api from 'API/index'
import { createArtistList, Artist} from 'UTIL/artist'

const StarArtist = () => {
  const [artists, setArtists] = useState<Artist[]>([])

  useEffect(() => {
    getUserCollectArtist()
  }, [])

  async function getUserCollectArtist () {
    try {
      const res = await api.getUserCollectArtist()
      setArtists(createArtistList(res.data.data))
    } catch (e) {}
  }
  return (
    <div className="star-artist">
      <div className="star-album-title">收藏的专辑(0)</div>
      <div>
        {
          artists.map(artist => (
            <div className="star-album-item">
              <img src={artist.picUrl} alt=""/>
              <div>{artist.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default StarArtist