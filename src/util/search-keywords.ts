import { useSelector, useDispatch } from "react-redux"
import { RootState } from "STORE/index"
import { SET_HISTORY_KEYWORDS, SET_SEARCH_KEYWORDS } from "STORE/commen/types"

export function useSearchKeywords () {
  const historyKeywords = useSelector((state: RootState) => state.commen.historyKeywords)
  const keywords = useSelector((state: RootState) => state.commen.keywords)
  const dispatch = useDispatch()

  function setKeywords (keywords: string) {
    dispatch({ type: SET_SEARCH_KEYWORDS, keywords })
  }

  function setHistoryKeywords (history: string[]) {
    dispatch({ type: SET_HISTORY_KEYWORDS, history })
  }

  function addKeywordsHistory (keywords: string) {
    const history = historyKeywords.slice()
    const index = historyKeywords.indexOf(keywords)
    if (index > -1) {
      history.splice(index, 1)
    }
    history.unshift(keywords)
    setHistoryKeywords(history)
  }

  function removeKeywordsHistory (keywords: string) {
    const history = historyKeywords.slice()
    const index = historyKeywords.indexOf(keywords)
    if (index > -1) {
      history.splice(index, 1)
    }
    setHistoryKeywords(history)
  }

  return {
    historyKeywords,
    keywords,
    setKeywords,
    addKeywordsHistory,
    removeKeywordsHistory
  }
}