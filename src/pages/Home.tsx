import { useEffect, useMemo, useState } from 'react'
import { SearchBar } from '../components/SearchBar'
import { TitleCard } from '../components/TitleCard'
import { TitleDetailsModal } from '../components/TitleDetailsModal'
import { getTitleByImdbId, searchTitles, type OmdbSearchItem, type OmdbTitleResponse } from '../lib/omdb'

const FEATURED_IMDB_IDS = [
  'tt0468569', // The Dark Knight
  'tt4154796', // Avengers: Endgame
  'tt0903747', // Breaking Bad
  'tt0944947', // Game of Thrones
  'tt0133093', // The Matrix
  'tt0111161', // The Shawshank Redemption
]

type OmdbTitleOk = Extract<OmdbTitleResponse, { Response: 'True' }>

function toSearchItem(x: OmdbTitleOk): OmdbSearchItem {
  return {
    Title: x.Title,
    Year: x.Year,
    imdbID: x.imdbID,
    Type: x.Type as OmdbSearchItem['Type'],
    Poster: x.Poster,
  }
}

export function Home() {
  const [query, setQuery] = useState('')
  const [page] = useState(1)
  const [results, setResults] = useState<OmdbSearchItem[] | null>(null)
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [openId, setOpenId] = useState<string | null>(null)

  const trimmed = query.trim()

  useEffect(() => {
    if (!trimmed) {
      setResults(null)
      setTotal(null)
      setError(null)
      return
    }

    const ctrl = new AbortController()
    const t = window.setTimeout(() => {
      setLoading(true)
      setError(null)
      searchTitles(trimmed, { page, signal: ctrl.signal })
        .then((res) => {
          if (res.Response === 'False') {
            setResults([])
            setTotal(0)
            setError(res.Error)
            return
          }
          setResults(res.Search)
          setTotal(Number(res.totalResults))
        })
        .catch((e: unknown) => {
          if ((e as { name?: string }).name === 'AbortError') return
          setError(e instanceof Error ? e.message : 'Search failed')
        })
        .finally(() => setLoading(false))
    }, 300)

    return () => {
      ctrl.abort()
      window.clearTimeout(t)
    }
  }, [trimmed, page])

  const [featured, setFeatured] = useState<OmdbSearchItem[] | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    Promise.all(
      FEATURED_IMDB_IDS.map((id) => getTitleByImdbId(id, { plot: 'short', signal: ctrl.signal })),
    )
      .then((arr) => {
        const ok = arr
          .filter((x): x is OmdbTitleOk => x.Response === 'True')
          .map(toSearchItem)
        setFeatured(ok)
      })
      .catch(() => {
        setFeatured([])
      })
    return () => ctrl.abort()
  }, [])

  const showingSearch = trimmed.length > 0

  const subtitle = useMemo(() => {
    if (!showingSearch) return 'Featured picks (powered by OMDb)'
    if (loading) return 'Searching…'
    if (error) return error
    if (results && total !== null) return `Found ${total.toLocaleString()} result(s)`
    return ''
  }, [showingSearch, loading, error, results, total])

  const list = showingSearch ? results : featured

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-red-600/20 via-white/5 to-white/0 p-6 md:p-10">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold tracking-widest text-white/70">NETFLIX-STYLE UI</div>
          <h1 className="mt-3 text-3xl font-black leading-tight text-white md:text-5xl">
            Find something great to watch.
          </h1>
          <p className="mt-3 text-sm text-white/70 md:text-base">
            Search OMDb and build your own <span className="text-white">My List</span>.
          </p>
          <div className="mt-6">
            <SearchBar value={query} onChange={setQuery} onSubmit={() => undefined} />
            <div className="mt-2 text-xs text-white/50">
              Tip: press <span className="rounded bg-white/10 px-1.5 py-0.5">/</span> to focus
              search
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">
            {showingSearch ? 'Search results' : 'Featured'}
          </h2>
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        </div>
        {showingSearch && (
          <button
            onClick={() => setQuery('')}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {(list ?? []).map((item) => (
          <TitleCard key={item.imdbID} item={item} onOpen={setOpenId} />
        ))}
      </div>

      {list && list.length === 0 && (
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Nothing to show yet. Try a different search.
        </div>
      )}

      {openId && <TitleDetailsModal imdbID={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}

