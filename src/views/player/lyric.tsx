import React, { useState, useEffect } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import { usePlayerController } from 'UTIL/player-controller'
import LyricClass, { LyricLine } from 'UTIL/lyric-parser'

const Lyric = () => {
  const [lines, setLines] = useState<LyricLine[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const { currentSong: { song } } = usePlayerController()

  useEffect(() => {
    getLyric()
  }, [song.id])

  async function getLyric () {
    try {
      const res = await api.getLyric(song.id)
      const lyric = new LyricClass(res.data, handler)
      setLines(lyric.lines)
      lyric.play(0, false)
    } catch (e) {}
  }

  function handler (currentLineIndex: number) {
    setCurrentLine(currentLineIndex)
    if (currentLineIndex > 3) {
      const container = document.querySelector('.player-info-lyrics')
      const lines = document.querySelectorAll('.player-info-lyrics-item')
      container!.scrollTop += lines[currentLineIndex].clientHeight + 16
    }
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