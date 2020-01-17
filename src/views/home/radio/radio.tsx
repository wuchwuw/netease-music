import React, { useState, useEffect } from 'react'
import api from 'API/index'
import Slider from 'COMPONENTS/slider/slider'

let loaded = false
let bannersCache = []

const Radio: React.SFC = () => {
  const [banners, setBanners] = useState([])

  useEffect(() => {
    getRecomend()
  }, [])

  function getRecomend () {
    Promise.all([
      api.getRadioBanner()
    ]).then(res => {
      setBanners(bannersCache = res[0].data.data)
    })
  }
  return (
    <div>
      <div className="home-banner-wrap">
        <Slider images={banners}></Slider>
      </div>
    </div>
  )
}

export default Radio