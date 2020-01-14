import React, { useEffect } from 'react'
import api from 'API/index'

const Toplist: React.SFC = () => {
  useEffect(() => {

  }, [])

  async function getToplist () {
    try {
      const res = await api.getTopList()
    }
  }

  return (
    <div></div>
  )
}