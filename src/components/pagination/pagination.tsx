import React, { useState } from 'react'
import './pagination.less'
import classnames from 'classnames'

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
  const [currentPage, setCurrentPage] = useState(10)
  const page = Math.floor(total / pageSize) + 1
  console.log(page)
  function goPage (page: number) {
    setCurrentPage(page)
  }
  function genPageList () {
    const pageList = []
    const first = <li onClick={() => { goPage(1) }} className={classnames("pagination-item")}>1</li>
    const last = <li className="pagination-item">{page}</li>
    const prev = <li className="pagination-item">...</li>
    const next = <li className="pagination-item">...</li>

    let left
    let right
    if (currentPage >= 5 && currentPage <= page - 5) {
      left = currentPage - 2
      right = currentPage + 2
      for (let i = left; i <= right; i ++) {
        pageList.push(
          <li className={classnames(
            'pagination-item',
            { 'pagination-item-active': currentPage === i}
          )}
          onClick={() => { goPage(i) }}
          >
            {i}
          </li>
        )
      }
      pageList.unshift(first, prev)
      pageList.push(next, last)
    } else if (currentPage < 5) {
      left = 2
      right = 5
      for (let i = left; i <= right; i ++) {
        pageList.push(
          <li className={classnames(
            'pagination-item',
            { 'pagination-item-active': currentPage === i}
          )}
          onClick={() => { goPage(i) }}
          >
            {i}
          </li>
        )
      }
      pageList.unshift(first)
      pageList.push(next, last)
    } else if (currentPage > page - 5) {
      left = page - 5
      right = page - 1
      for (let i = left; i <= right; i ++) {
        pageList.push(
          <li className={classnames(
            'pagination-item',
            { 'pagination-item-active': currentPage === i}
          )}
          onClick={() => { goPage(i) }}
          >
            {i}
          </li>
        )
      }
      pageList.unshift(first, prev)
      pageList.push(last)
    }
    return pageList
  }

  return (
    <ul className="pagination-container">
      <li className="pagination-item"><i className="iconfont icon-arrow rorate"></i></li>
      {genPageList()}
      <li className="pagination-item"><i className="iconfont icon-arrow"></i></li>
    </ul>
  )
}

export default Pagination