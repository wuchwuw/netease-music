import React, { useState, useEffect } from 'react'
import Song from 'UTIL/song'
import api from 'API/index'
import './cloud.less'
import dayjs from 'dayjs'
import { padZero } from 'UTIL/util'
import Button from 'COMPONENTS/button/button'
import { usePlayerController } from 'UTIL/player-controller'
import Icon from 'COMPONENTS/icon/icon'
import Pagination from 'COMPONENTS/pagination/pagination'
import classnames from 'classnames'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import PageTitle from 'COMPONENTS/page-title/page-title'

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
  return data.map((item: any) => {
    let ar = item.simpleSong.ar || [{ id: 0, name: item.artist || '未知歌手' }]
    let al = item.simpleSong.al || { id: 0, name: item.album || '未知专辑' }
    return new CloudSong({
      ...item,
      simpleSong: {
        ...item.simpleSong,
        ar,
        al
      }
    })
  })
}

function getSize (size: number) {
  return `${(size / 1024 / 1024 / 1024).toFixed(1)}G`
}

let limit = 50
let offset = 0

const Cloud = () => {
  const [songs, setSongs] = useState<CloudSong[]>([])
  const { start } = usePlayerController()
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const { goAlbumDetail, goArtistDetail } = usePageForword()
  const [cloudReset, setCloudReset] = useState('0.0G/0.0G')
  const [cloudPercent, setCloudPercent] = useState(0)

  useEffect(() => {
    getUserCloud()
  }, [])

  async function getUserCloud () {
    try {
      const res = await api.getUserCloud({ limit, offset })
      setSongs(createCloudSongList(res.data.data))
      setTotal(res.data.count)
      setCloudReset(`${getSize(res.data.size)}/${getSize(res.data.maxSize)}`)
      setCloudPercent(res.data.size / res.data.maxSize)
    } catch (e) {}
  }

  function onPageChange (page: number) {
    offset = (page - 1) * limit
    getUserCloud()
    setCurrentPage(page)
  }

  return (
    <div styleName="cloud-container">
      <PageTitle><span className="topbar-content-title">我的音乐云盘</span></PageTitle>
      <div styleName="cloud-title">
        <span>云盘容量</span>
        <span styleName="cloud-disk-bar">
          <span styleName="cloud-disk-bar-default"></span>
          <span styleName="cloud-disk-bar-current" style={{width: `${cloudPercent}%`}}></span>
        </span>
        <span>{cloudReset}</span>
        <span>歌曲永久保存，随时随地多端畅听</span>
      </div>
      <div styleName="cloud-disk-option">
        <Button
          icon={<Icon name="icon-play"></Icon>}
          type="primary"
          onClick={() => { start({id: '/cloud', name: '我的音乐云盘'}, songs[0], songs) }}
        >
          播放全部
        </Button>
      </div>
      <ul styleName="cloud-list">
        <li styleName="cloud-list-item-wrap">
          <div styleName="cloud-list-item">
            <div></div>
            <div>音乐标题</div>
            <div>歌手</div>
            <div>专辑</div>
            <div>格式</div>
            <div>大小</div>
            <div>上传时间</div>
          </div>
        </li>
        {
          songs.map((song, index) => (
            <li onDoubleClick={() => { start({ id: 'cloud', name: '我的音乐云盘'}, song, songs) }} key={song.id} styleName="cloud-list-item-wrap">
              <div styleName="cloud-list-item">
                <div><span>{padZero(index + 1)}</span></div>
                <div><span>{song.name}{song.alia_string}</span></div>
                <div><span>{genArtists(song.artists, goArtistDetail, 'commen-link-666666')}</span></div>
                <div><span onClick={() => { goAlbumDetail(song.album.id) }} className={classnames('commen-link-666666', { 'active': song.album.id })}>{song.album.name}</span></div>
                <div><span>{song.fileType}</span></div>
                <div><span>{song.size}</span></div>
                <div><span>{song.uploadTime}</span></div>
              </div>
            </li>
          ))
        }
      </ul>
      { total > limit && <Pagination currentPage={currentPage} total={total} pageSize={limit} onChange={onPageChange}></Pagination> }
    </div>
  )
}

export default Cloud