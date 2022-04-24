import React, { useEffect } from 'react'

export default (key: string, defaultValue: any = ''): [any, React.Dispatch<any>] => {
  let value: any
  try {
    value = JSON.parse(localStorage.getItem(key) as string)
  } catch (error) {
    console.error(error)
  }
  const [state, setState] = React.useState(
    () => value || defaultValue,
  )
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])
  return [state, setState]
}
