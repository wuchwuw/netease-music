import { ArtistBaseClass } from 'UTIL/artist'
import classnames from 'classnames'
import React from 'react'
import Song from 'UTIL/song'
import Icon from 'COMPONENTS/icon/icon'
import { padZero } from 'UTIL/util'

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
        {song.name}<span className="commen-link-999999">{song.alia_string}</span>
      </div>
      { song.isHighQuality && <span className="icon-music-highquality">SQ</span> }
      { !!song.mv && <Icon style={{marginLeft: '2px'}} name="icon-mv" className="icon-color-main hover"></Icon> }
    </div>
  )
}

export function genSongNumber (songIndex: number, song: Song, currentSong: Song) {
  return currentSong.id === song.id ? <Icon name="icon-sound" className="icon-color-main"></Icon> : padZero(songIndex + 1)
}