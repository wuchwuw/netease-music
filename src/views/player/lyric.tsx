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
  const lyricHeightCache = useRef<number[]>([])

  useEffect(() => {
    if (song.id) {
      getLyric()
    }
  }, [song.id])

  useEffect(() => {
    if (lyric.current) {
      if (playing) {
        console.log(getPlayCurrentTime())
        lyric.current.play(getPlayCurrentTime() * 1000, false)
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
      console.log(lyric.current.lines)
      if (scroll.current) {
        scroll.current.refresh()
      } else {
        initScroll()
      }
      setTimeout(() => {
        initHeight()
        if (playing) {
          lyric.current && lyric.current.play(getPlayCurrentTime() * 1000, false)
        }
      }, 16.9)
    } catch (e) { console.log(e) }
  }

  function initScroll () {
    scroll.current = new BScroll('#lyrics')
  }

  function initHeight () {
    let height = 0
    list.current.forEach((item, index) => {
      lyricHeightCache.current[index] = height
      height += (item.clientHeight + 16)
    })
    console.log(lyricHeightCache.current)
  }

  function handler (currentLineIndex: number) {
    // if (currentLineCache.current === currentLineIndex) return
    // const currentEl = list.current[currentLineIndex]
    // const elHeight = currentEl.clientHeight + 16
    // console.log(currentEl.offsetTop)
    // scrollHeight.current = currentEl.offsetTop
    console.log(scroll.current!.maxScrollY)
    console.log(currentLineIndex)
    const height = lyricHeightCache.current[currentLineIndex]
    const scrollTo = height - 140
    // const scrollMax = Math.abs(scroll.current!.maxScrollY) - 160
    if (scrollTo > 0) {
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
    </div>
  )
}

export default Lyric