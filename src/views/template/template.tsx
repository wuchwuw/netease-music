import { ArtistBaseClass } from 'UTIL/artist'
import classnames from 'classnames'
import React from 'react'
import Song from 'UTIL/song'

export function genArtists (artists: ArtistBaseClass[], action: (id: number) => void, style: string) {
    if (!artists) return null
    return artists.map((artist, index) =>
      <span key={index} className={style}>
        <span
          onClick={ (e) => {
            e.stopPropagation()
            if (!artist.id) return
            action(artist.id)
          }}
          className={classnames(style, { 'active': artist.id })}>{artist.name}
        </span>
        { index !== artists.length - 1 && '/' }
      </span>
    )
}

export function genSongName (song: Song) {
  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      <div className="text-overflow" title={song.name}>
        {song.name}<span className="music-list-item-alia">{song.alia_string}</span>
      </div>
      { song.isHighQuality && <span className="music-list-item-highquality">SQ</span> }
      { !!song.mv && <i className="iconfont icon-mv"></i> }
    </div>
  )
}