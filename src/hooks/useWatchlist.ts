import { useEffect, useMemo, useState } from 'react'
import { getWatchlist, onWatchlistChange, type WatchlistItem } from '../lib/watchlist'

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>(() => getWatchlist())

  useEffect(() => {
    return onWatchlistChange(() => setItems(getWatchlist()))
  }, [])

  const byId = useMemo(() => new Map(items.map((x) => [x.imdbID, x])), [items])

  return { items, byId }
}

