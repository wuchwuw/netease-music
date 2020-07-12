import { useCallback, useRef, useEffect, EffectCallback, DependencyList } from 'react'


export function useDebouncedEffect (effect: EffectCallback, delay: number, deps: DependencyList) {
  const effectFn = useCallback(effect, deps)
  useEffect(() => {
    const timer = setTimeout(effectFn, delay)
    return () => {
      clearTimeout(timer)
    }
  }, [effectFn])
}

export function useUpdateEffect (effect: EffectCallback, deps?: DependencyList) {
  const first = useRef(true)
  useEffect(() => {
    if (!first.current) {
      return effect()
    }
  }, deps)
}