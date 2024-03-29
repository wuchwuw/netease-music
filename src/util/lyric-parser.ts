const timeExp = /\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g

const STATE_PAUSE = 0
const STATE_PLAYING = 1

const tagRegMap = {
  title: 'ti',
  artist: 'ar',
  album: 'al',
  offset: 'offset',
  by: 'by'
}

function noop (currentLineIndex: number) {}

export interface LyricLine {
  txt: string
  time: number
  translate: string
}

export default class Lyric {
  lrc: string
  tlrc: string
  tags: any
  lines: LyricLine[]
  handler: (currentLineIndex: number) => void
  state: number
  curLine: number
  isPure: boolean
  uncollected: boolean
  constructor({ lrc = {}, tlyric = {}, nolyric = false, uncollected = false } : any, hanlder: (currentLineIndex: number ) => void = noop) {
    this.lrc = lrc.lyric
    this.tlrc = tlyric.lyric
    this.tags = {}
    this.lines = []
    this.handler = hanlder
    this.state = STATE_PAUSE
    this.curLine = 0
    this.isPure = nolyric
    this.uncollected = uncollected
    if (!this.isPure && !this.uncollected) {
      this._init()
    }
  }

  _init() {
    // this._initTag()
    this._initLines()
  }

  // _initTag() {
  //   for (let tag in tagRegMap) {
  //     const matches = this.lrc.match(new RegExp(`\\[${tagRegMap[tag]}:([^\\]]*)]`, 'i'))
  //     this.tags[tag] = matches && matches[1] || ''
  //   }
  // }

  _initLines() {
    if (!this.lrc) {
      return
    }
    const lines = this.lrc ? this.lrc.split('\n') : []
    const tLines = this.tlrc ? this.tlrc.split('\n') : []
    function getLine (lineStr: string) {
      const result: any = timeExp.exec(lineStr)
      let res = null
      if (result) {
        const txt = lineStr.replace(timeExp, '').trim()
        if (txt) {
          res = {
            time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 1,
            txt
          }
        }
      }
      return res
    }

    let index = 0
    let tIndex = 0

    while (index < lines.length) {
      const lineRes = getLine(lines[index])
      const tLineRes = getLine(tLines[tIndex])
      if (!tLineRes) tIndex ++
      if (lineRes) {
        let res = {
          time: lineRes.time,
          txt: lineRes.txt,
          translate: ''
        }
        if (tLineRes && tLineRes.time === lineRes.time) {
          res.translate = tLineRes.txt
          tIndex ++
        }
        this.lines.push(res)
      }
      index ++
    }
    // const offset = parseInt(this.tags['offset']) || 0
    // for (let i = 0; i < lines.length; i++) {
    //   const line = lines[i]
    //   let result = timeExp.exec(line)
    //   console.log(result)
    //   if (result) {
    //     const txt = line.replace(timeExp, '').trim()
    //     if (txt) {
    //       this.lines.push({
    //         time: result[1] * 60 * 1000 + result[2] * 1000 + (result[3] || 0) * 1,
    //         txt
    //       })
    //     }
    //   }
    // }

    this.lines.sort((a, b) => {
      return a.time - b.time
    })
  }

  _findCurNum(time: number) {
    for (let i = 0; i < this.lines.length; i++) {
      if (time <= this.lines[i].time) {
        return i
      }
    }
    return this.lines.length - 1
  }

  _callHandler(i: number) {
    if (i < 0) {
      return
    }
    this.handler(i)
  }

  _playRest() {
    let line = this.lines[this.curNum]
    let delay = line.time - (+new Date() - this.startStamp)

    this.timer = setTimeout(() => {
      this._callHandler(this.curNum++)
      if (this.curNum < this.lines.length && this.state === STATE_PLAYING) {
        this._playRest()
      }
    }, delay)
  }

  play(startTime = 0, skipLast) {
    if (!this.lines.length) {
      return
    }
    this.state = STATE_PLAYING

    this.curNum = this._findCurNum(startTime)
    this.startStamp = +new Date() - startTime

    if (!skipLast) {
      this._callHandler(this.curNum - 1)
    }

    if (this.curNum < this.lines.length) {
      clearTimeout(this.timer)
      this._playRest()
    }
  }

  togglePlay() {
    var now = +new Date()
    if (this.state === STATE_PLAYING) {
      this.stop()
      this.pauseStamp = now
    } else {
      this.state = STATE_PLAYING
      this.play((this.pauseStamp || now) - (this.startStamp || now), true)
      this.pauseStamp = 0
    }
  }

  stop() {
    this.state = STATE_PAUSE
    clearTimeout(this.timer)
  }

  seek(offset) {
    this.play(offset)
  }
}