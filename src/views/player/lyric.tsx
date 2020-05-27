import React, { useState } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import { usePlayerController } from 'UTIL/player-controller'


const Lyric = () => {
  const [lines, setLines] = useState([])
  const [currentLine, setCurrentLine] = useState(0)
  const { currentSong: { song } } = usePlayerController()

  function getLyric () {
    try {
      const res = api.getLyric(song.id)

    } catch (e) {}
  }

  return (
    <div className="lyric-container">
      {
        lines.map((item: any, index: any) => (
          <div key={index} className={classnames('player-info-lyrics-item', { 'active': index === currentLine})}>
            <div>{item.txt}</div>
            { item.translate && <div className="player-info-lyrics-item-translate">{item.translate}</div> }
          </div>
        ))
      }
    </div>
  )
}

export default Lyric