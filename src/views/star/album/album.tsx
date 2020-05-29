import React, { useState } from 'react'
import api from 'API/index'

let offset = 0

const StarAlbum = () => {
  const [albums, setAlbums] = useState([])
  
  async function getUserCollectAlbum() {
    try {
      const res = await api.getUserCollectAlbum({ offset, limit: 25 })
    } catch (e) {}
  }  

  return (
    <div className="star-album">
      <div className="star-album-title"></div>
    </div>
  )
}

export default StarAlbum