import React from 'react'
import { render, RenderResult } from '@testing-library/react'
import Button, { ButtonProps } from '../../src/components/button/button'

const props: ButtonProps = {
  type: 'primary',
  onClick: jest.fn()
}

let wrap: RenderResult, buttonEl: HTMLElement
describe('test button components', () => {
  it('test basic Button behavior ', () => {
    wrap = render(<Button {...props}>Button Test</Button>)
    buttonEl = wrap.queryByText('Button Test')
    expect(buttonEl).toBeTruthy()
    expect(buttonEl).toBeInTheDocument()
    expect(buttonEl).toHaveClass('button-content')
  })
})