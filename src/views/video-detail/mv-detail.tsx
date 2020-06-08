import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { MV } from 'UTIL/mv'
import { usePageForword } from 'ROUTER/hooks'

const VideoDetail = () => {
  const { id } = useParams()
  const mvId = Number(id)
  const [mv, setMV ] = useState<MV>(new MV({}))
  const [related, setRelated] = useState<MV[]>([])
  const [url, setURL] = useState('')
  const { back } = usePageForword()

  useEffect(() => {
    getMVDetail()
    getRelatedVideo()
    getMVURL()
  }, [])

  async function getMVDetail () {
    try {
      const res = await Promise.all([api.getMVDetail({ mvid: mvId }), api.getMVInfo({ mvid: mvId })])
      setMV(new MV({
        ...res[0].data.data,
        ...res[1].data
      }))
    } catch (e) {}
  }

  async function getRelatedVideo () {
    try {
      const res = await api.getRelatedMV({ mvid: mvId })
      setRelated(res.data.mvs.map((item: any) => new MV(item)))
    } catch (e) {}
  }

  async function getMVURL () {
    try {
      const res = await api.getMVURL({ id: mvId })
      setURL(res.data.data.url)
    } catch (e) {}
  }

  return (
    <div className="video-detail">
      <div className="video-detail-container">
        <div className="video-detail-info">
          <div onClick={() => { back() }} className="video-detail-title"><i className="iconfont icon-arrow"></i>MV详情</div>
          <div className="video-detail-player">
            <video autoPlay controls id="video" src={url}></video>
          </div>
          <div className="video-detail-user">
            <img src={mv.artists[0].img1v1Url} alt=""/>
            <span>{mv.artists[0].name}</span>
          </div>
          <div className="video-detail-info-title">{mv.name}</div>
          <div className="video-detail-info-count">发布:&nbsp;{mv.publishTime}&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;{mv.playCount}次</div>
          <div className="video-detail-info-option">
            <span className="artist-info-option-star"><i className="iconfont icon-zan"></i>赞({mv.likedCount})</span>
            <span className="artist-info-option-user"><i className="iconfont icon-star"></i>收藏({mv.subCount})</span>
            <span className="artist-info-option-user"><i className="iconfont icon-share"></i>分享({mv.shareCount})</span>
          </div>
          <Comment type="mv" showTitle id={mvId}></Comment>
        </div>
        <div className="video-detail-related">
          <div className="video-detail-title">相关推荐</div>
          <ul className="video-related-list">
            {
              related.map(mv => (
                <li className="video-related-list-item">
                  <div className="video-related-list-item-img">
                    <img src={mv.cover} alt=""/>
                    <div className="video-related-list-item-duration">{mv.duration_format}</div>
                    <div className="video-related-list-item-playcount"><i className="iconfont icon-triangle"></i>{mv.playCount_format}</div>
                  </div>
                  <div className="video-related-list-item-info">
                    <div>{mv.name}</div>
                    {/* <div>by {mv.creator.nickname}</div> */}
                  </div>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoDetail