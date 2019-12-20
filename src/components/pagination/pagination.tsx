import React, { useState } from 'react'
import './pagination.less'

interface PaginationProps {
  defaultCurrentPage?: number
  pageSize: number
  total: number
  onChange: (currentPage: number) => void
}

const Pagination: React.SFC<PaginationProps> = ({
  defaultCurrentPage = 1,
  pageSize = 10,
  total = 0,
  onChange
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const page = Math.floor(total / pageSize) + 1
  
  
  function genPageList () {
    const pageList = []
    const prevNode = <li className="pagination-item"><i className="iconfont icon-arrow rorate"></i></li>
    const nextNode = <li className="pagination-item"><i className="iconfont icon-arrow"></i></li>
  }

  return (
    <ul className="pagination-container">
      <li className="pagination-item"><i className="iconfont icon-arrow rorate"></i></li>
      <li className="pagination-item pagination-item-active">1</li>
      <li className="pagination-item">2</li>
      <li className="pagination-item">3</li>
      <li className="pagination-item">4</li>
      <li className="pagination-item">5</li>
      <li className="pagination-item"><i className="iconfont icon-arrow"></i></li>
    </ul>
  )
}

export default Pagination