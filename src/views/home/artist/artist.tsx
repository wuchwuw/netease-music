import React, { useState, useEffect } from 'react'
import api from 'API/index'
import './artist.less'

const Artist: React.SFC = () => {
  const [artists, setArtists] = useState([])

  useEffect(() => {
    getArtists()
  }, [])

  async function getArtists () {
    try {
      const params = {
        limit: 30,
        cat: '',
        initial: '',
        offset: 0
      }
      const res = await api.getArtist(params)
      setArtists(res.data.artists)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="artist">
      <div className="artist-filter">
        <div className="commen-filter-item">
          <span>语种:</span>
          <div>
            <span className="active">华语</span>
            <span>欧美</span>
            <span>日本</span>
            <span>韩国</span>
          </div>
        </div>
        <div className="commen-filter-item">
          <span>分类:</span>
          <div>
            <span>男歌手</span>
            <span>女歌手</span>
            <span>乐队组合</span>
          </div>
        </div>
        <div className="commen-filter-item">
          <span>筛选:</span>
          <div>
            <span>A</span>
            <span>B</span>
            <span>C</span>
            <span>D</span>
          </div>
        </div>
      </div>
      <div className="artist-content">
        {
          artists.map(artist => (
            <div key={artist.id} className="artist-item">
              <img src={artist.picUrl + '?param=250y250'} alt=""/>
              <div>{artist.name}</div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Artist