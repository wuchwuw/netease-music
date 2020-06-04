import React, { useEffect, useState } from 'react'
import api from 'API/index'
import { createArtistList, Artist} from 'UTIL/artist'
import './artist.less'
import { usePageForword } from 'ROUTER/hooks'
// import Pagination from 'COMPONENTS/pagination/pagination'

// let offset = 0
// let limit = 5

const StarArtist = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const { goArtistDetail } = usePageForword()
  // const [total, setTotal] = useState(0)
  // const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getUserCollectArtist()
  }, [])

  async function getUserCollectArtist () {
    try {
      const res = await api.getUserCollectArtist({ limit: 30, offset: 0 })
      setArtists(createArtistList(res.data.data))
      // setTotal(res.data.count)
    } catch (e) {}
  }

  // function onPageChange (page: number) {
  //   setCurrentPage(page)
  //   offset = (page - 1) * limit
  //   getUserCollectArtist()
  // }

  return (
    <div className="star-artist">
      <div className="star-artist-title">收藏的歌手({artists.length})</div>
      <div className="star-artist-list">
        {
          artists.map(artist => (
            <div className="star-artist-item" onClick={() => { goArtistDetail(artist.id) }}>
              <img src={artist.picUrl + '?param=100y100'} alt=""/>
              <div className="star-artist-info">
                <div className="star-artist-info-name commen-link-333333 active">
                  {artist.name}
                  <span className="star-artist-info-alia">{artist.alia_string}</span>
                </div>
                <div className="star-artist-info-artist">
                  <span>专辑：{artist.albumSize}</span>
                  <span>MV：{artist.mvSize}</span>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      {/* {
        total > limit && (
          <div className="pagination-wrap">
            <Pagination currentPage={currentPage} onChange={onPageChange} total={total} pageSize={limit}></Pagination>
          </div>
        )
      } */}
    </div>
  )
}

export default StarArtist