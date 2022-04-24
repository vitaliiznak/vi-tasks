import { useState, useEffect } from 'react'
import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '../appConstants'

export function useAuthToken(
  newToken?: string,
):
  [string, (_s: string) => void] {
  const previousToken = localStorage.getItem(AUTH_TOKEN_LOCALSTORAGE_KEY)
  const [token, setToken] = useState<string>(previousToken || newToken || '')

  useEffect(() => {
    localStorage.setItem(AUTH_TOKEN_LOCALSTORAGE_KEY, token)
    return () => {/* blank ovveride */ }
  }, [token])
  return [token, setToken]
}

export default {}
