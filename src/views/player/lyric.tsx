import React, { useState, useEffect } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import LyricClass, { LyricLine } from 'UTIL/lyric-parser'
import Song from 'UTIL/song'
import './lyric.less'

interface LyricProps {
  song: Song
}

const Lyric: React.SFC<LyricProps> = ({
  song
}) => {
  const [lines, setLines] = useState<LyricLine[]>([])
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    getLyric()
  }, [song.id])

  async function getLyric () {
    try {
      const res = await api.getLyric({ id: song.id })
      const lyric = new LyricClass(res.data, handler)
      setLines(lyric.lines)
      // lyric.play(0, false)
    } catch (e) {}
  }

  function handler (currentLineIndex: number) {
    setCurrentLine(currentLineIndex)
    // if (currentLineIndex > 3) {
    //   const container = document.querySelector('.player-info-lyrics')
    //   const lines = document.querySelectorAll('.player-info-lyrics-item')
    //   container!.scrollTop += lines[currentLineIndex].clientHeight + 16
    // }
  }

  return (
    <div styleName="player-info-lyrics">
      {
        lines.map((item: any, index: any) => (
          <div key={index} styleName={classnames('player-info-lyrics-item', { 'active': index === currentLine})}>
            <div>{item.txt}</div>
            { item.translate && <div styleName="player-info-lyrics-item-translate">{item.translate}</div> }
          </div>
        ))
      }
    </div>
  )
}

export default Lyric