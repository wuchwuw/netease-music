import React, { useState, useEffect } from "react"
import './search.less'
import Spin from 'COMPONENTS/spin/spin'
import api from 'API/index'

const Search: React.SFC = () => {
  const [loading, setLoading] = useState(true)
  const history = []
  const [hot, setHot] = useState([])

  useEffect(() => {
    getHotKey()
  }, [])

  async function getHotKey () {
    try {
      setLoading(true)
      const { data: { result } } = await api.getHotKeyword()
      setHot(result.hots)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="search-panel-container">
      <div className="search-panel-title">热门搜索</div>
        <Spin loading={loading} delay={300}>
          <div className="search-panel-keyword">
            {
              hot.map((item: any) => (
                <span key={item.first}>{item.first}</span>
              ))
            }
          </div>
        </Spin>
      <div className="search-panel-title">搜索历史</div>
      <div className="search-panel-keyword">
        
      </div>
    </div>
  )
}

export default Search