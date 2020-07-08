import { useState } from 'react'
import api from 'API/index'
import { AxiosResponse } from 'axios'

const a = [api.addFMTrash, api.addOrRemoveSong]
type b = typeof a

type BeforeFetchReturnType<T> = 
  T extends (params: infer P) => Promise<AxiosResponse<any>> ? P : T extends () => Promise<AxiosResponse<any>> ? void : void
type AfterFetchType = (res: AxiosResponse<any>) => void
type ApiType<T> = ((params: BeforeFetchReturnType<T>) => Promise<AxiosResponse<any>>) | (() => Promise<AxiosResponse<any>>)

export function useRequest<T> (api: ApiType<T>) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  
  async function fetch (beforeFetch: () => BeforeFetchReturnType<T>, afterFetch: AfterFetchType) {
    try {
      setLoading(true)
      const res = await api(beforeFetch())
      afterFetch(res)
      setLoading(false)
    } catch (e) {
      setError(true)
      console.log(e)
    }
  }

  return {
    fetch,
    loading,
    error
  }
}