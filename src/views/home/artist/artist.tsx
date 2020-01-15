import React, { useState, useEffect } from 'react'
import api from 'API/index'

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
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="artist">
      <div className="artist-filter">
        <div>
          <span>语种</span>
          <div></div>
        </div>
        <div>
          <span>分类</span>
        </div>
        <div>
          <span>筛选</span>
        </div>
      </div>
    </div>
  )
}

export default Artist