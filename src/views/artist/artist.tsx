import React from 'react'
import { useParams } from 'react-router'

const Artist = () => {
  const { id } = useParams()
  const artistId = Number(id)

  // async function getArtistDetail () {
  //   try {
  //     const res = api.getArtistDetail()
  //   } catch (e) {}
  // }
  return (
    <div className="artist-container">
      <div className="artist-info">

      </div>
    </div>
  )
}

export default Artist