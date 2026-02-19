const STORAGE_KEY = 'netflixclone2:watchlist:v1'
const WATCHLIST_EVENT = 'netflixclone2:watchlist:changed'

export type WatchlistItem = {
  imdbID: string
  title: string
  year?: string
  type?: string
  poster?: string
  addedAt: number
}

function safeJsonParse<T>(value: string | null): T | undefined {
  if (!value) return undefined
  try {
    return JSON.parse(value) as T
  } catch {
    return undefined
  }
}

export function getWatchlist(): WatchlistItem[] {
  const parsed = safeJsonParse<WatchlistItem[]>(localStorage.getItem(STORAGE_KEY))
  return Array.isArray(parsed) ? parsed : []
}

export function isInWatchlist(imdbID: string): boolean {
  return getWatchlist().some((x) => x.imdbID === imdbID)
}

export function addToWatchlist(item: Omit<WatchlistItem, 'addedAt'>): WatchlistItem[] {
  const existing = getWatchlist()
  if (existing.some((x) => x.imdbID === item.imdbID)) return existing
  const next = [{ ...item, addedAt: Date.now() }, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(WATCHLIST_EVENT))
  return next
}

export function removeFromWatchlist(imdbID: string): WatchlistItem[] {
  const next = getWatchlist().filter((x) => x.imdbID !== imdbID)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(WATCHLIST_EVENT))
  return next
}

export function onWatchlistChange(callback: () => void): () => void {
  window.addEventListener('storage', callback)
  window.addEventListener(WATCHLIST_EVENT, callback)
  return () => {
    window.removeEventListener('storage', callback)
    window.removeEventListener(WATCHLIST_EVENT, callback)
  }
}

