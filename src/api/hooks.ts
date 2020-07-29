import { useState, useRef } from 'react'
import { AxiosResponse } from 'axios'
import api from 'API/index'

type BeforeFetchReturnType<T> =
  T extends (params: infer P) => Promise<AxiosResponse<any>> ? P : T extends () => Promise<AxiosResponse<any>> ? void : void
type ApiType<T> = ((params: BeforeFetchReturnType<T>) => Promise<AxiosResponse<any>>) | (() => Promise<AxiosResponse<any>>)

export function useLoadMoreParams (limitInit?: number) {
  const offset = useRef(0)
  const before = useRef(-1)
  const lasttime = useRef(-1)
  const limit = useRef(limitInit || 0)
  const hasmore = useRef(true)
  const moreloading = useRef(false)
  const {} = useFetch<typeof api.addOrRemoveSong>(api.addOrRemoveSong)

  function setHasMore (more: boolean) {
    hasmore.current = more
  }

  function setMoreLoading (loading: boolean) {
    moreloading.current = loading
  }

  function setOffset (o: number) {
    offset.current = o
  }

  function setBefore (b: number) {
    before.current = b
  }

  function setLasttime (l: number) {
    lasttime.current = l
  }

  return {
    offset,
    before,
    lasttime,
    limit,
    hasmore,
    moreloading,
    setHasMore,
    setMoreLoading,
    setOffset,
    setBefore,
    setLasttime
  }
}

export function useFetch<T> (api: ApiType<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [timeout, setTimeout] = useState(false)

  async function fetch (beforeFetch: () => BeforeFetchReturnType<T>, afterFetch?: (res: AxiosResponse<any>) => void, handleError?: (e: any) => void) {
    try {
      setLoading(true)
      const res = await api(beforeFetch())
      afterFetch && afterFetch(res)
      setLoading(false)
    } catch (e) {
      setError(true)
      handleError && handleError(e)
      console.log(e)
    }
  }

  return {
    fetch,
    loading,
    timeout,
    error
  }
}