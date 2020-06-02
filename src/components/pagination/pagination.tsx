import React, { useState } from 'react'
import './pagination.less'
import classnames from 'classnames'
import { scrollToTop } from 'COMPONENTS/scroll-to-top/scroll-to-top'

interface PaginationProps {
  defaultCurrentPage?: number
  pageSize: number
  total: number
  onChange: (currentPage: number) => void
  currentPage: number
  scrollToTopFn?: any
}

const Pagination: React.SFC<PaginationProps> = ({
  defaultCurrentPage = 1,
  pageSize = 10,
  total = 0,
  onChange,
  currentPage = 1,
  scrollToTopFn = scrollToTop
}) => {
  // const [currentPage, setCurrentPage] = useState(current)
  const page = total % pageSize === 0 ? total / pageSize : Math.floor(total / pageSize) + 1
  function goPage (page: number) {
    if (page === currentPage) return
    onChange(page)
    scrollToTop()
  }
  function genPageList () {
    const pageList = []
    const first = <li onClick={() => { goPage(1) }} className={classnames("pagination-item", {'pagination-item-active': currentPage === 1})}>1</li>
    const last = <li onClick={() => { goPage(page) }} className={classnames("pagination-item", {'pagination-item-active': currentPage === page})}>{page}</li>
    const prev = <li className="pagination-item">...</li>
    const next = <li className="pagination-item">...</li>

    let left
    let right

    if (page <= 10) {
      left = 1
      right = page
      for (let i = left; i <= right; i ++) {
        pageList.push(
          <li className={classnames(
            'pagination-item',
            {'pagination-item-active': currentPage === i}
          )}
          onClick={() => { goPage(i) }}
          >
            {i}
          </li>
        )
      }
      return pageList
    }

    if (currentPage >= 5 && currentPage <= page - 5) {
      left = currentPage - 2
      right = currentPage + 2
      for (let i = left; i <= right; i ++) {
        pageList.push(
          <li className={classnames(
            'pagination-item',
            {'pagination-item-active': currentPage === i}
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
            {'pagination-item-active': currentPage === i}
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
            {'pagination-item-active': currentPage === i}
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