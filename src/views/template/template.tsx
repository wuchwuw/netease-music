import { ArtistBaseClass } from 'UTIL/artist'
import classnames from 'classnames'
import React from 'react'

export function genArtists (artists: ArtistBaseClass[], action: (id: number) => void, style: string) {
    return artists.map((artist, index) => 
      <span key={artist.id} className={style}>
        <span
          onClick={ (e) => {
            e.stopPropagation() 
            if (!artist.id) return
            action(artist.id)
          }} 
          className={classnames(style, { 'active': artist.id })}>{artist.name}
        </span>
        { index !== artists.length - 1 && ' / ' }
      </span>
    )
}