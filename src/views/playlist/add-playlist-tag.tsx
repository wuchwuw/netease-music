import React, { useEffect, useState } from 'react'
import './add-playlist-tag.less'
import { useContainer } from 'COMPONENTS/container/container'
import api from 'API/index'
import classnames from 'classnames'
import Button from 'COMPONENTS/button/button'

interface PlaylistCate {
  name: string,
  hot: boolean
  id: number
}

interface AllCate {
  cate: string,
  sub: PlaylistCate[]
}

interface AddPlaylistTagProps {
  children: React.ReactNode
  selected: string[]
  onSave: (selected: string[]) => void
}

const AddPlaylistTag: React.SFC<AddPlaylistTagProps> = ({ children, selected = [], onSave }) => {
  const [allCate, setAllCate] = useState<AllCate[]>([])
  const { open, visible, close } = useContainer(['#add-playlist-tag-container'])
  const [select, setSelect] = useState(selected)

  useEffect(() => {
    getAllCate()
  }, [])

  useEffect(() => {
    setSelect([...selected])
  }, [selected.length])

  async function getAllCate () {
    try {
      const res = await api.getPlaylistAllCate()
      const cate = Object.keys(res.data.categories).map(key => {
        return {
          cate: res.data.categories[key],
          sub: res.data.sub.filter((item: any) => item.category === Number(key))
        }
      })
      setAllCate(cate)
    } catch (e) {}
  }

  function onCateSelect (cate: string) {
    let res = select.slice()
    if (!res.includes(cate)) {
      if (res.length === 3) return
      res.push(cate)
    } else {
      res = res.filter(item => item !== cate)
    }
    setSelect(res)
  }

  return (
    <>
      <span id="add-playlist-tag-container" styleName="add-playlist-tag-container" onClick={open}>
        {children}
        {
          visible && (
            <div styleName="add-playlist-cate-wrap">
              <div styleName="playlist-cate">
                {
                  allCate.map(item => (
                    <div key={item.cate} styleName="playlist-cate-item">
                      <span styleName="playlist-cate-label">{item.cate}</span>
                      <div styleName="playlist-cate-wrap">
                        {
                          item.sub.map(scate => (
                            <span key={scate.name} onClick={() => { onCateSelect(scate.name) }} styleName={classnames({'active': select.includes(scate.name)})}>{scate.name}</span>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
              <div styleName="add-playlist-tag-button"><Button onClick={(e) => { e.stopPropagation(); onSave(select); close() }} type="primary">保存</Button></div>
            </div>
          )
        }
      </span>
    </>
  )
}

export default AddPlaylistTag