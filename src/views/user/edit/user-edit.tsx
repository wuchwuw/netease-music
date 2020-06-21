import React, { useState } from 'react'
import './user-edit.less'
import { Select } from 'COMPONENTS/select/select'
import { area, getCities } from 'UTIL/area/area'
import { useSelector } from 'react-redux'
import { RootState } from 'STORE/index'
import Button from 'COMPONENTS/button/button'
import { usePageForword } from 'ROUTER/hooks'

const MaxYear = (new Date).getFullYear()

const yearOption = Array.from({ length: 100 }, (v, k) => MaxYear - k ).map(item => ({ label: `${item}年`, value: item }))
const monOption = Array.from({ length: 12 }, (v, k) => k + 1 ).map(item => ({ label: `${item}月`, value: item }))
const dayOption = Array.from({ length: 31 }, (v, k) => k + 1 ).map(item => ({ label: `${item}日`, value: item }))
const genderOption = {
  '保密': 0,
  '男': 1,
  '女': 2
}

const UserEdit = () => {
  const user = useSelector((state: RootState) => state.user.user)
  const d = user.birthday ? new Date(user.birthday) : undefined
  const [nickname, setNickname] = useState(user.nickname)
  const [signature, setSignature] = useState(user.signature)
  const [cityId, setCityId] = useState(user.city)
  const [provinceId, setProvinceId] = useState(user.province)
  const [year, setYear] = useState(d ? d.getFullYear() : '')
  const [month, setMonth] = useState(d ? d.getMonth() + 1 : '')
  const [day, setDay] = useState(d ? d.getDate() : '')
  const [gender, setGender] = useState(user.gender)
  const [cityOption, setCityOption] = useState(getCities(user.province))
  const { back } = usePageForword()

  function updateUsertInfo () {

  }

  function onProvinceChange (value: any) {
    setProvinceId(value)
    setCityId(0)
    setCityOption(getCities(value))
  }

  return (
    <div className="user-edit-container">
      <div className="playlist-form">
        <div className="playlist-form-item">
          <span>昵称:</span>
          <input onChange={(e) => { setNickname(e.target.value) }} value={nickname} type="text"/>
        </div>
        <div className="playlist-form-item">
          <span>简介:</span>
          <textarea onChange={(e) => { setSignature(e.target.value) }} rows={6} value={signature}/>
        </div>
        <div className="playlist-form-item">
          <span>性别:</span>
          {
            (Object.keys(genderOption)).map((item: any) => (
              <div className="form-item-radio">
                <span onClick={() => { setGender(genderOption[item]) }} className={gender === genderOption[item] ? 'active' : ''}></span>
                {item}
              </div>
            ))
          }
        </div>
        <div className="playlist-form-item">
          <span>生日:</span>
          <Select options={yearOption} value={year} onChange={() => {}}></Select>
          <Select options={monOption} value={month} onChange={() => {}}></Select>
          <Select options={dayOption} value={day} onChange={() => {}}></Select>
        </div>
        <div className="playlist-form-item">
          <span>地区:</span>
          <Select valueName="id" labelName="name" options={area} value={provinceId} onChange={onProvinceChange}></Select>
          <Select valueName="id" labelName="name" options={cityOption} value={cityId} onChange={setCityId}></Select>
        </div>
      </div>
      <div className="playlist-form-button">
        <Button type="primary" onClick={()=> { updateUsertInfo() }}>保存</Button>
        <Button onClick={back}>取消</Button>
      </div>
    </div>
  )
}

export default UserEdit