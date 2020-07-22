import React, { useState, useEffect } from 'react'
import './all-mv.less'
import classnames from 'classnames'
import api from 'API/index'
import { createMVList, MV } from 'UTIL/mv'
import { genArtists } from 'VIEWS/template/template'
import { usePageForword } from 'ROUTER/hooks'
import Spin from 'COMPONENTS/spin/spin'
import LoadMore from 'COMPONENTS/load-more/load-more'
import { getQueryStringValue, setQueryStringValue } from 'ROUTER/hooks'
import { useHistory, useLocation } from 'react-router'

const AreaOption = ['全部', '内地', '欧美', '日本', '韩国']
const TypeOption = ['全部', '官方版', '原声', '现场版', '网易出品']
const orderOption = ['上升最快', '最热', '最新']

let hasmore = true
let more_loading = false
let offset = 0
let limit = 30
let firstRender = true

const AllMV = () => {
  const query = getQueryStringValue()
  const [area, setArea] = useState(query.area || '全部')
  const [type, setType] = useState(query.type || '全部')
  const [order, setOrder] = useState(query.order || '上升最快')
  const [mv, setMV] = useState<MV[]>([])
  const { goArtistDetail, goMVDetail } = usePageForword()
  const [loading, setLoading] = useState(true)
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    setLoading(true)
    getAllMV(false)
    return () => {
      hasmore = true
      more_loading = false
      offset = 0
    }
  }, [area, type, order])

  useEffect(() => {
    if (!firstRender) {
      const query = getQueryStringValue()
      setArea(query.area || '全部')
      setType(query.type || '全部')
      setOrder(query.order || '上升最快')
    }
    firstRender = false
  }, [location.search])

  async function getAllMV (loadmore: boolean) {
    try {
      const params = {
        area,
        type,
        order,
        limit,
        offset
      }
      more_loading = true
      const res = await api.getAllMV(params)
      loadmore ? setMV(mv => mv.concat(createMVList(res.data.data))) : setMV(createMVList(res.data.data))
      setLoading(false)
      hasmore = res.data.hasMore
      more_loading = false
    } catch (e) {}
  }

  function setTab (type: string, value: string) {
    setQueryStringValue({ [type]: value }, history)
  }

  function loadmore () {
    if (!hasmore) return
    if (more_loading) return
    offset = offset + limit
    getAllMV(true)
  }

  return (
    <LoadMore load={loadmore}>
      <div styleName="allmv-container">
        <div>
          <div styleName="artist-filter-item">
            <span>语种:</span>
            <div>
              {
                AreaOption.map(item => (
                  <span key={item} onClick={() => { setTab('area', item) }} styleName={classnames({ 'active': item === area })}>{item}</span>
                ))
              }
            </div>
          </div>
          <div styleName="artist-filter-item">
            <span>类型:</span>
            <div>
              {
                TypeOption.map(item => (
                  <span key={item} onClick={() => { setTab('type', item) }} styleName={classnames({ 'active': item === type })}>{item}</span>
                ))
              }
            </div>
          </div>
          <div styleName="artist-filter-item">
            <span>排序:</span>
            <div>
              {
                orderOption.map(item => (
                  <span key={item} onClick={() => { setTab('order', item) }} styleName={classnames({ 'active': item === order })}>{item}</span>
                ))
              }
            </div>
          </div>
        </div>
        <Spin loading={loading} delay={0}>
          <div className="commen-area-content">
            {
              mv.map(mv => (
                <div key={mv.id} className="commen-area-item commen-area-item-large">
                  <div onClick={() => { goMVDetail(mv.id) }} className="commen-area-img-wrap">
                    <div className="commen-area-playcount"><i className="iconfont icon-triangle"></i>{mv.playCount_format}</div>
                    <div className="commen-area-play-icon"><i className="iconfont icon-triangle-full"></i></div>
                    <img src={mv.cover + '?param=500y282'} alt=""/>
                  </div>
                  <div onClick={() => { goMVDetail(mv.id) }} className="commen-area-text text-overflow">{mv.name}</div>
                  <div className="commen-area-artist text-overflow">{genArtists(mv.artists, goArtistDetail, 'commen-link-999999')}</div>
                </div>
              ))
            }
          </div>
        </Spin>
      </div>
    </LoadMore>
  )
}

export default AllMV