import React, { useEffect, useState } from 'react'
import './video-detail.less'
import { useParams } from 'react-router'
import Comment from 'COMPONENTS/comment/comment'
import api from 'API/index'
import { MV } from 'UTIL/mv'
import { usePageForword } from 'ROUTER/hooks'
import { createShareDialog, ShareType } from 'COMPONENTS/dialog/create'
import Button from 'COMPONENTS/button/button'
import Icon from 'COMPONENTS/icon/icon'
import classnames from 'classnames'
import { genArtists } from 'VIEWS/template/template'

let mvCache: any = {}

const VideoDetail = () => {
  const { id } = useParams()
  const mvId = Number(id)
  const [mv, setMV ] = useState<MV>(new MV({}))
  const [related, setRelated] = useState<MV[]>([])
  const [url, setURL] = useState('')
  const { back, goArtistDetail } = usePageForword()
  const openShareDialog = createShareDialog()

  useEffect(() => {
    getMVDetail()
    getRelatedVideo()
    getMVURL()
  }, [mvId])

  async function getMVDetail () {
    try {
      const res = await Promise.all([api.getMVDetail({ mvid: mvId }), api.getMVInfo({ mvid: mvId })])
      setMV(new MV(mvCache = {
        ...res[0].data.data,
        subed: res[0].data.subed,
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

  async function like () {
    try {
      const params = {
        t: mv.liked ? 2 : 1,
        type: 1,
        id: mv.id
      }
      await api.likeResource(params)
      setMV(new MV(mvCache = {
        ...mvCache,
        likedCount: mv.liked ? -- mv.likedCount : ++ mv.likedCount,
        liked: !mv.liked
      }))
    } catch (e) { console.log(e) }
  }
  
  async function sub () {
    try {
      const params = {
        t: mv.subed ? 2 : 1,
        mvid: mv.id
      }
      await api.subMV(params)
      setMV(new MV(mvCache = {
        ...mvCache,
        subCount: mv.subCount ? -- mv.subCount : ++ mv.subCount,
        subed: !mv.subed
      }))
    } catch (e) {}
  }

  return (
    <div styleName="video-detail">
      <div styleName="video-detail-container">
        <div styleName="video-detail-info">
          <span onClick={() => { back() }} styleName="video-detail-title" className="commen-link-333333 active">
            <Icon fontSize={18} name="icon-arrow-left"></Icon>
            MV详情
          </span>
          <div styleName="video-detail-player">
            <video controls id="video" src={url}></video>
          </div>
          <div styleName="video-detail-user">
            <img src={mv.artists[0].img1v1Url + '?params=100y100'} alt=""/>
            <span className="commen-link-333333 active">{mv.artists[0].name}</span>
          </div>
          <div styleName="video-detail-info-title">{mv.name}</div>
          <div styleName="video-detail-info-count">发布:&nbsp;{mv.publishTime}&nbsp;&nbsp;&nbsp;&nbsp;播放:&nbsp;{mv.playCount}次</div>
          <div styleName="video-detail-info-option">
            <Button onClick={like} icon={<Icon className={classnames({ 'icon-color-main': mv.liked })} name="icon-zan"></Icon>}>赞({mv.likedCount})</Button>
            <Button onClick={sub} icon={<Icon name="icon-star"></Icon>}>{mv.subed ? '已收藏' : '收藏'}({mv.subCount})</Button>
            <Button onClick={() => { openShareDialog({ type: ShareType.MV, shareContent: mv }) }} icon={<Icon name="icon-share"></Icon>}>分享({mv.shareCount})</Button>
          </div>
          <Comment type="mv" showTitle id={mvId}></Comment>
        </div>
        <div styleName="video-detail-related">
          <div styleName="video-detail-title">相关推荐</div>
          <ul>
            {
              related.map(mv => (
                <li styleName="video-related-list-item">
                  <div styleName="video-related-list-item-img">
                    <img src={mv.cover} alt=""/>
                    <div styleName="video-related-list-item-duration">{mv.duration_format}</div>
                    <div styleName="video-related-list-item-playcount"><Icon name="icon-triangle"></Icon>{mv.playCount_format}</div>
                  </div>
                  <div styleName="video-related-list-item-info">
                    <div styleName="video-related-list-item-info-title" className="commen-link-333333 active">{mv.name}</div>
                    <div>{genArtists(mv.artists, goArtistDetail, 'commen-link-999999')}</div>
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