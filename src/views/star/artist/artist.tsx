import React, { useEffect, useState } from 'react'
import api from 'API/index'
import { createArtistList, Artist} from 'UTIL/artist'
import './artist.less'
import { usePageForword } from 'ROUTER/hooks'
import Icon from 'COMPONENTS/icon/icon'
// import Pagination from 'COMPONENTS/pagination/pagination'

// let offset = 0
// let limit = 5

const StarArtist = () => {
  const [artists, setArtists] = useState<Artist[]>([])
  const { goArtistDetail, goUserDetail } = usePageForword()
  const [total, setTotal] = useState(0)
  // const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    getUserCollectArtist()
  }, [])

  async function getUserCollectArtist () {
    try {
      const res = await api.getUserCollectArtist({ limit: 30, offset: 0 })
      setArtists(createArtistList(res.data.data))
      setTotal(res.data.count)
    } catch (e) {}
  }

  // function onPageChange (page: number) {
  //   setCurrentPage(page)
  //   offset = (page - 1) * limit
  //   getUserCollectArtist()
  // }

  return (
    <div styleName="star-artist">
      <div styleName="star-artist-title">收藏的歌手({total})</div>
      <div styleName="star-artist-list">
        {
          artists.map(artist => (
            <div key={artist.id} className="commen-item-artist">
              <img onClick={ () => { goArtistDetail(artist.id) } } src={artist.img1v1Url + '?param=250y250'} alt=""/>
              <div className="commen-item-artist-info">
                <span className="commen-link-333333 active">{artist.name}</span>
                { artist.accountId && <Icon onClick={ (e) => { e.stopPropagation(); goUserDetail(artist.accountId) } } name="icon-user"></Icon>}
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