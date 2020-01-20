import React, { useEffect, useState } from 'react'
import api from 'API/index'

const Viode: React.SFC = () => {
  const [tags, setTags] = useState([])
  useEffect(() => {
    getVideoTags()
  }, [])

  async function getVideoTags () {
    try {
      const res = await api.getVideoTags()
    } catch (e) { console.log(e) }
  }
  return (
    <div>aaaa</div>
  )
}

export default Viode