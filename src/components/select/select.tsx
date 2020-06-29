import React, { useState, useEffect } from 'react'
import './select.less'
import { useContainer } from 'COMPONENTS/container/container'
import Icon from 'COMPONENTS/icon/icon'

interface SelectProps {
  options: any[]
  value: any,
  valueName?: string,
  labelName?: string,
  onChange: (value: any) => void,
  placeholder?: string
}

const Select: React.SFC<SelectProps> = ({
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
    <div styleName="select">
      <div onClick={open} styleName="select-content">
        <input placeholder={placeholder} value={label} readOnly styleName="select-content-text"></input>
        <span styleName="select-content-icon"><Icon name="icon-triangle-full"></Icon></span>
      </div>
      {
        visiable && (
          <ul styleName="select-option">
            {
              options.map(option => (
                <li key={option[valueName]} onClick={() => { onSelectChange(option) }} styleName="select-option-item">{option[labelName]}</li>
              ))
            }
          </ul>
        )
      }
    </div>
  )
}

export default Select