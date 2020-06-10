import React, { useEffect, useState } from 'react'
import './add-playlist-tag.less'
import { useContainer } from 'COMPONENTS/container/container'
import api from 'API/index'
import classnames from 'classnames'

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
}

const AddPlaylistTag: React.SFC<AddPlaylistTagProps> = ({ children, selected = [] }) => {
  const [allCate, setAllCate] = useState<AllCate[]>([])
  const { open, visiable } = useContainer(['.add-playlist-tag-container'])
  const [select, setSelect] = useState(selected)

  useEffect(() => {
    getAllCate()
  }, [])

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
      <span className="add-playlist-tag-container" onClick={open}>
        {children}
        {
          visiable && (
            <div className="add-playlist-cate-wrap">
              <div className="playlist-cate">
                {
                  allCate.map(item => (
                    <div key={item.cate} className="playlist-cate-item">
                      <span className="playlist-cate-label">{item.cate}</span>
                      <div className="playlist-cate-wrap">
                        {
                          item.sub.map(scate => (
                            <span key={scate.name} onClick={() => { onCateSelect(scate.name) }} className={classnames({'active': select.includes(scate.name)})}>{scate.name}</span>
                          ))
                        }
                      </div>
                    </div>
                  ))
                }
              </div>
              <div className="playlist-cate-button">保存</div>
            </div>
          )
        }
      </span>
    </>
  )
}

export default AddPlaylistTag