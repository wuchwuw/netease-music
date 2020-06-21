import React, { useState, useEffect } from 'react'
import './select.less'
import { useContainer } from 'COMPONENTS/container/container'

interface SelectProps {
  options: any[]
  value: any,
  valueName?: string,
  labelName?: string,
  onChange: (value: any) => void,
  placeholder?: string
}

export const Select: React.SFC<SelectProps> = ({
  onChange,
  labelName = 'label',
  valueName = 'value',
  options = [],
  value,
  placeholder = '请选择'
}) => {
  const { visiable, open } = useContainer([])
  const [label, setLabel] = useState('')

  useEffect(() => {
    selectDefaultLabel()
  }, [value])

  function onSelectChange (option: any) {
    if (option[valueName] === value) return
    onChange(option[valueName])
    setLabel(option[labelName])
  }

  function selectDefaultLabel () {
    let item = options.find(item => item[valueName] === value)
    setLabel(item ? item[labelName] : '')
  }

  return (
    <div className="select">
      <div onClick={open} className="select-content">
        <input placeholder={placeholder} value={label} readOnly className="select-content-text"></input>
        <span className="select-content-icon"><i className="iconfont icon-triangle-full"></i></span>
      </div>
      {
        visiable && (
          <ul className="select-option">
            {
              options.map(option => (
                <li key={option[valueName]} onClick={() => { onSelectChange(option) }} className="select-option-item">{option[labelName]}</li>
              ))
            }
          </ul>
        )
      }
    </div>
  )
}
