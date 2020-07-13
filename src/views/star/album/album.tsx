import React, { useState, useEffect } from 'react'
import api from 'API/index'
import { createAlbumList, Album } from 'UTIL/album'
import './album.less'
import Pagination from 'COMPONENTS/pagination/pagination'
import { usePageForword } from 'ROUTER/hooks'
import { genArtists } from 'VIEWS/template/template'
import Icon from 'COMPONENTS/icon/icon'

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
        <div className="commen-area-content">
          {
            albums.map(album => (
              <div key={album.id} onClick={() => goAlbumDetail(album.id) } className={`commen-area-item commen-item-album`}>
                <div className="commen-area-img-wrap">
                  <img className="commen-area-img" src={album.picUrl +'?param=250y250'} alt=""/>
                </div>
                <div className="commen-area-text line-more">{album.name}</div>
                <div className="commen-area-artist">{ genArtists(album.artists, goArtistDetail, 'commen-link-666666')}</div>
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