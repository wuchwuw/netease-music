import React, { useState, useEffect } from 'react'
import './playlist-edit.less'
import AddPlaylistTag from 'VIEWS/playlist/add-playlist-tag'
import Button from 'COMPONENTS/button/button'
import api from 'API/index'
import { useParams } from 'react-router'
import { PlaylistClass } from 'UTIL/playlist'
import notificationApi from 'COMPONENTS/notification'
import { usePageForword } from 'ROUTER/hooks'

const PlylistEdit = () => {
  const { id } = useParams()
  const playlistId = Number(id)
  const [playlist, setPlaylist] = useState<PlaylistClass>(new PlaylistClass({}))
  const [selected, setSelected] = useState<string[]>([]) 
  const [name, setName] = useState('') 
  const [desc, setDesc] = useState('')
  const { goPlaylistDetail, back } = usePageForword()

  useEffect(() => {
    getPlaylistDetail()
  }, [])

  async function getPlaylistDetail () {
    try {
      const res = await api.getPlaylist({ id: playlistId })
      const p = new PlaylistClass(res.data.playlist)
      setPlaylist(p)
      setName(p.name)
      setSelected(p.tags)
      setDesc(p.description)
    } catch (e) {}
  }

  async function updatePlaylistInfo () {
    if (name === '') {
      notificationApi.error({
        content: '歌单名不能为空'
      })
    }
    try {
      const parmas = {
        id: playlistId,
        name,
        desc,
        tags: selected.join(';')
      }
      const res = await api.updatePlaylistInfo(parmas)
      console.log(res)
      processFallback(res.data)
    } catch (e) {
      console.log(e)
    }
  }

  function onTagSave (selected: string[]) {
    setSelected(selected)
  }

  function processFallback (fallback: any) {
    const keys = ['/api/playlist/update/name', '/api/playlist/tags/update', '/api/playlist/desc/update']
    const hasError = keys.some(key => {
      const value = fallback[key]
      if (value && value.code !== 200) {
        notificationApi.error({
          content: value.message || '更新歌单信息失败'
        })
        return true
      } else {
        return false
      }
    })
    if (!hasError) {
      goPlaylistDetail(playlistId)
    }
  } 

  return (
    <div className="playlist-edit-container">
      <div className="playlist-edit-title">编辑歌单信息</div>
      <div className="playlist-form">
        <div className="playlist-form-item">
          <span>歌单名:</span>
          <input value={name} onChange={(e) => { setName(e.target.value) }} type="text"/>
        </div>
        <div className="playlist-form-item">
          <span>标签:</span>
          <div className="playlist-edit-selected">
            {
              selected.map(tag => (
                <span key={tag}>{tag}</span>
              ))
            }
          </div>
          <AddPlaylistTag onSave={onTagSave} selected={selected}><span className="playlist-form-addtag">添加标签</span></AddPlaylistTag>
        </div>
        <div className="playlist-form-item">
          <span>简介:</span>
          <textarea rows={5} value={desc} onChange={(e) => { setDesc(e.target.value) }}/>
        </div>
        <div className="playlist-form-button">
          <Button type="primary" onClick={()=> { updatePlaylistInfo() }}>保存</Button>
          <Button onClick={back}>取消</Button>
        </div>
      </div>
      <img className="playlist-edit-cover" src={playlist.coverImgUrl} alt=""/>
    </div>
  )
}

export default PlylistEdit