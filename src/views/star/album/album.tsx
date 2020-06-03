import React, { useState, useEffect } from 'react'
import api from 'API/index'
import { createAlbumList, Album } from 'UTIL/album'
import './album.less'

let offset = 0

const StarAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([])

  useEffect(() => {
    getUserCollectAlbum()
  }, [])

  async function getUserCollectAlbum() {
    try {
      const res = await api.getUserCollectAlbum({ offset, limit: 25 })
      setAlbums(createAlbumList(res.data.data))
    } catch (e) {}
  }

  return (
    <div className="star-album">
      <div className="star-album-title">收藏的专辑(0)</div>
      <div>
        {
          albums.map(album => (
            <div className="star-album-item">
              <img src={album.picUrl} alt=""/>
              <div>{album.name}</div>
              <div>{album.artistName}</div>
              <div>{album.size}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default StarAlbum