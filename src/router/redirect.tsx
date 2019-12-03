import { Redirect } from 'react-router'
import React from 'react'

export function createRedirect (path: string): React.SFC {
  return () => <Redirect to={path}></Redirect>
}