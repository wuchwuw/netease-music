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

const LYRIC_HEIGHT = 320
const SCROLL_TO = 140

const Lyric: React.SFC<LyricProps> = ({
  song
}) => {
  const [lines, setLines] = useState<LyricLine[]>([])
  const [currentLine, setCurrentLine] = useState(0)
  const scroll = useRef<BScroll>()
  const list = useRef<HTMLDivElement[]>([])
  const { getPlayCurrentTime, playing } = usePlayerController()
  const lyric = useRef<LyricClass>()
  const lyricHeightCache = useRef<number[]>([])
  const first = useRef(true)
  const [isPure, setIsPure] = useState(false)

  useEffect(() => {
    if (song.id) {
      lyric.current && lyric.current.stop()
      scroll.current && scroll.current.scrollTo(0, 0)
      setCurrentLine(0)
      getLyric()
    }
  }, [song.id])

  useEffect(() => {
    if (lyric.current) {
      if (playing) {
        lyric.current.play(getPlayCurrentTime() * 1000, false)
      } else {
        lyric.current.stop()
      }
    }
  }, [playing])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (lines.length) {
      initScroll()
      initHeight()
      if (playing) {
        lyric.current && lyric.current.play(getPlayCurrentTime() * 1000, false)
      }
    }
  }, [lines])

  async function getLyric () {
    try {
      const res = await api.getLyric({ id: song.id })
      lyric.current = new LyricClass(res.data, handler)
      if (lyric.current.isPure) {
        setIsPure(true)
      } else {
        setIsPure(false)
        setLines(lyric.current.lines)
      }
    } catch (e) { console.log(e) }
  }

  function initScroll () {
    scroll.current = new BScroll('#lyrics')
  }

  function initHeight () {
    let height = 0
    list.current.forEach((item, index) => {
      if (item) {
        lyricHeightCache.current[index] = height
        height += (item.clientHeight + 16)
      }
    })
  }

  function handler (currentLineIndex: number) {
    const height = lyricHeightCache.current[currentLineIndex]
    const scrollTo = height - 140
    const maxHeight = scroll.current!.maxScrollY
    const resetHeight = Math.abs(maxHeight) + 140
    if (scrollTo > 0 && height < resetHeight) {
      scroll.current && scroll.current.scrollTo(0, -scrollTo, 1000)
    }
    setCurrentLine(currentLineIndex)
  }

  function play () {
    lyric.current && lyric.current.play(getPlayCurrentTime(), false)
  }

  function stop () {
    lyric.current && lyric.current.stop()
  }

  function reset () {

  }

  return (
    <div id="lyrics" styleName="player-info-lyrics">
      {
        isPure ?
        <div>纯音乐，请您欣赏</div>
        :
        <div>
          {
            lines.map((item: any, index: any) => (
              <div ref={el => list.current[index] = el!} key={index} styleName={classnames('player-info-lyrics-item', { 'active': index === currentLine})}>
                <div>{item.txt}</div>
                { item.translate && <div styleName="player-info-lyrics-item-translate">{item.translate}</div> }
              </div>
            ))
          }
        </div>
      }
    </div>
  )
}

export default Lyric