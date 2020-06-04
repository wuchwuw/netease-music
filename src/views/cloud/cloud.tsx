import React, { useState, useEffect } from 'react'
import Song from 'UTIL/song'
import api from 'API/index'
import './cloud.less'
import dayjs from 'dayjs'
import { padZero } from 'UTIL/util'

class CloudSong extends Song {
  fileType: string
  size: string
  uploadTime: string

  constructor ({fileSize, fileName, addTime, simpleSong}: any) {
    super(simpleSong)
    this.size = `${(fileSize / 1024 / 1024).toFixed(2)}MB`
    const file = fileName.split('.')
    this.fileType = file.length ? file[file.length - 1] : ''
    this.uploadTime = dayjs(addTime).format('YYYY-MM-DD')
  }
}

function createCloudSongList (data: any = []) {
  return data.map((item: any) => new CloudSong(item))
}

let limit = 100
let offset = 0

const Cloud = () => {
  const [songs, setSongs] = useState<CloudSong[]>([])


  useEffect(() => {
    getUserCloud()
  }, [])

  async function getUserCloud () {
    try {
      const res = await api.getUserCloud({ limit, offset })
      console.log(res)
      setSongs(createCloudSongList(res.data.data))
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="cloud-container">
      <div className="cloud-title">
        <span>云盘容量</span>
        <span className="cloud-disk-bar">
          <span className="cloud-disk-bar-default"></span>
          <span className="cloud-disk-bar-current"></span>
        </span>
        <span>0.1G/60G</span>
        <span>歌曲永久保存，随时随地多端畅听</span>
      </div>
      <ul className="cloud-list">
        <li className="cloud-list-item-wrap">
          <div className="cloud-list-item">
            <div></div>
            <div>音乐标题</div>
            <div>歌手</div>
            <div>专辑</div>
            <div>时长</div>
            <div>格式</div>
            <div>大小</div>
            <div>上传时间</div>
          </div>
        </li>
        {
          songs.map((song, index) => (
            <li key={song.id} className="cloud-list-item-wrap">
              <div className="cloud-list-item">
              <div>{padZero(index + 1)}</div>
              <div>{song.name}</div>
              <div>{song.artistName}</div>
              <div>{song.album.name}</div>
              <div>{song.duration_string}</div>
              <div>{song.fileType}</div>
              <div>{song.size}</div>
              <div>{song.uploadTime}</div>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default Cloud