import React, { useState, useEffect, useRef } from 'react'
import api from 'API/index'
import classnames from 'classnames'
import LyricClass, { LyricLine } from 'UTIL/lyric-parser'
import Song from 'UTIL/song'
import './lyric.less'
import BScroll from 'better-scroll'
import { usePlayerController } from 'UTIL/player-controller'

interface LyricProps {
  song: Song
}

const Lyric: React.SFC<LyricProps> = ({
  song
}) => {
  const [lines, setLines] = useState<LyricLine[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const scroll = useRef<BScroll>()
  const list = useRef<HTMLDivElement[]>([])
  const { getPlayCurrentTime, playing } = usePlayerController()
  const lyric = useRef<LyricClass>()

  useEffect(() => {
    getLyric()
  }, [song.id])

  useEffect(() => {
    if (lyric.current) {
      if (playing) {
        lyric.current.play(getPlayCurrentTime(), false)
      } else {
        lyric.current.stop()
      }
    }
  }, [playing])

  async function getLyric () {
    try {
      const res = await api.getLyric({ id: song.id })
      lyric.current = new LyricClass(res.data, handler)
      setLines(lyric.current.lines)
      initScroll()
      if (playing) {
        lyric.current.play(getPlayCurrentTime(), false)
      }
    } catch (e) {}
  }

  function initScroll () {
    scroll.current = new BScroll('#lyrics')
  }

  function handler (currentLineIndex: number) {
    let a = list.current[currentLineIndex].scrollTop
    console.log(a)
    setCurrentLine(currentLineIndex)
    if (currentLineIndex > 5) {
      scroll.current && scroll.current.scrollToElement(list.current[currentLineIndex - 5], 1000)
    }
    // console.log(currentLineIndex)
    // if (currentLineIndex > 3) {
    //   const container = document.querySelector('.player-info-lyrics')
    //   const lines = document.querySelectorAll('.player-info-lyrics-item')
    //   container!.scrollTop += lines[currentLineIndex].clientHeight + 16
    // }
  }

  return (
    <div id="lyrics" styleName="player-info-lyrics">
      <div>
        {
          lines.map((item: any, index: any) => (
            <div ref={el => list.current[index] = el} key={index} styleName={classnames('player-info-lyrics-item', { 'active': index === currentLine})}>
              <div>{item.txt}</div>
              { item.translate && <div styleName="player-info-lyrics-item-translate">{item.translate}</div> }
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Lyric