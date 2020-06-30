import React, { useState, useEffect } from 'react'
import api from 'API/index'
import { createAlbumList, Album } from 'UTIL/album'
import './album.less'
import Pagination from 'COMPONENTS/pagination/pagination'
import { usePageForword } from 'ROUTER/hooks'
import { genArtists } from 'VIEWS/template/template'

let offset = 0
let limit = 30

const StarAlbum = () => {
  const [albums, setAlbums] = useState<Album[]>([])
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { goAlbumDetail, goArtistDetail } = usePageForword()

  useEffect(() => {
    getUserCollectAlbum()
  }, [])

  async function getUserCollectAlbum() {
    try {
      const res = await api.getUserCollectAlbum({ offset, limit })
      setAlbums(createAlbumList(res.data.data))
      setTotal(res.data.count)
    } catch (e) {}
  }

  function onPageChange (page: number) {
    setCurrentPage(page)
    offset = (page - 1) * limit
    getUserCollectAlbum()
  }

  return (
    <div styleName="star-album">
      <div styleName="star-album-title">收藏的专辑({total})</div>
      <div styleName="star-album-list">
        {
          albums.map(album => (
            <div styleName="star-album-item" onClick={() => { goAlbumDetail(album.id) }}>
              <img src={album.picUrl + '?param=100y100'} alt=""/>
              <div styleName="star-album-info">
                <div className="commen-link-333333 active">
                  {album.name}
                  <span styleName="star-album-info-alia">{album.alia_string}</span>
                </div>
                <div styleName="star-album-info-artist">
                  { genArtists(album.artists, goArtistDetail, 'commen-link-666666')}
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {
        total > limit && (
          <div className="pagination-wrap">
            <Pagination currentPage={currentPage} onChange={onPageChange} total={total} pageSize={limit}></Pagination>
          </div>
        )
      }
    </div>
  )
}

export default StarAlbum