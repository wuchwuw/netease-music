import React from 'react'
import './search.less'

const Search: React.SFC = (props) => {
  return (
    <div className="search-container">
      <div className="search-keyword-wrap">
        <span className="search-keyword">周杰伦</span>
        <span className="search-keyword-num">找到 0 首单曲</span>
      </div>
      <div className="search-tab">
        <span className="search-tab-item active">单曲</span>
        <span className="search-tab-item">歌手</span>
        <span className="search-tab-item">专辑</span>
        <span className="search-tab-item">视频</span>
        <span className="search-tab-item">歌单</span>
        <span className="search-tab-item">歌词</span>
        <span className="search-tab-item">主播电台</span>
        <span className="search-tab-item">用户</span>
      </div>
      <div className="search-multimatch-wrap">
        <span className="search-multimatch-title">最佳匹配</span>
      </div>
    </div>
  )
}

export default Search