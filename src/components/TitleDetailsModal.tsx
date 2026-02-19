import { useEffect, useMemo, useState } from 'react'
import { X, Plus, Check } from 'lucide-react'
import { getTitleByImdbId, type OmdbTitleResponse } from '../lib/omdb'
import { addToWatchlist, isInWatchlist, removeFromWatchlist } from '../lib/watchlist'

function field(v: string | undefined) {
  if (!v || v === 'N/A') return undefined
  return v
}

export function TitleDetailsModal({
  imdbID,
  onClose,
}: {
  imdbID: string
  onClose: () => void
}) {
  const [data, setData] = useState<OmdbTitleResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [inList, setInList] = useState(() => isInWatchlist(imdbID))

  useEffect(() => {
    setInList(isInWatchlist(imdbID))
  }, [imdbID])

  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setError(null)
    setData(null)

    getTitleByImdbId(imdbID, { plot: 'full', signal: ctrl.signal })
      .then((res) => {
        setData(res)
        if (res.Response === 'False') setError(res.Error)
      })
      .catch((e: unknown) => {
        if ((e as { name?: string }).name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'Failed to load title')
      })
      .finally(() => setLoading(false))

    return () => ctrl.abort()
  }, [imdbID])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  const title = useMemo(() => {
    if (!data || data.Response === 'False') return undefined
    return field(data.Title)
  }, [data])

  const poster = useMemo(() => {
    if (!data || data.Response === 'False') return undefined
    return field(data.Poster)
  }, [data])

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="min-w-0">
            <div className="truncate text-base font-semibold text-white">
              {title ?? (loading ? 'Loading…' : 'Title')}
            </div>
            <div className="mt-0.5 text-xs text-white/60">{imdbID}</div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[240px_1fr]">
          <div className="mx-auto w-full max-w-[240px]">
            <div className="aspect-[2/3] overflow-hidden rounded-xl border border-white/10 bg-white/5">
              {poster ? (
                <img src={poster} alt={title ?? imdbID} className="h-full w-full object-cover" />
              ) : (
                <div className="grid h-full w-full place-items-center text-sm text-white/60">
                  No poster
                </div>
              )}
            </div>

            <div className="mt-3">
              <button
                onClick={() => {
                  if (!data || data.Response === 'False') return
                  const next = !inList
                  setInList(next)
                  if (next) {
                    addToWatchlist({
                      imdbID,
                      title: data.Title,
                      year: field(data.Year),
                      type: field(data.Type),
                      poster: field(data.Poster),
                    })
                  } else {
                    removeFromWatchlist(imdbID)
                  }
                }}
                className={[
                  'flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                  inList
                    ? 'bg-white text-black hover:bg-white/90'
                    : 'bg-red-600 text-white hover:bg-red-500',
                ].join(' ')}
                disabled={loading || !!error || !data || data.Response === 'False'}
              >
                {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {inList ? 'In My List' : 'Add to My List'}
              </button>
              <div className="mt-2 text-center text-xs text-white/50">
                Stored in your browser (localStorage)
              </div>
            </div>
          </div>

          <div className="min-w-0">
            {loading ? (
              <div className="space-y-3">
                <div className="h-4 w-2/3 rounded bg-white/10" />
                <div className="h-4 w-1/2 rounded bg-white/10" />
                <div className="h-24 w-full rounded bg-white/10" />
              </div>
            ) : error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {error}
              </div>
            ) : data && data.Response === 'True' ? (
              <>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                  {field(data.Year) && <span className="font-medium text-white">{data.Year}</span>}
                  {field(data.Rated) && <span>{data.Rated}</span>}
                  {field(data.Runtime) && <span>{data.Runtime}</span>}
                  {field(data.Genre) && <span>{data.Genre}</span>}
                </div>

                {field(data.Plot) && (
                  <p className="mt-4 text-sm leading-relaxed text-white/80">{data.Plot}</p>
                )}

                <dl className="mt-5 grid gap-3 text-sm">
                  {field(data.Director) && (
                    <div className="grid grid-cols-[90px_1fr] gap-2">
                      <dt className="text-white/50">Director</dt>
                      <dd className="text-white/80">{data.Director}</dd>
                    </div>
                  )}
                  {field(data.Actors) && (
                    <div className="grid grid-cols-[90px_1fr] gap-2">
                      <dt className="text-white/50">Cast</dt>
                      <dd className="text-white/80">{data.Actors}</dd>
                    </div>
                  )}
                  {field(data.imdbRating) && (
                    <div className="grid grid-cols-[90px_1fr] gap-2">
                      <dt className="text-white/50">Rating</dt>
                      <dd className="text-white/80">{data.imdbRating} / 10</dd>
                    </div>
                  )}
                  {field(data.BoxOffice) && (
                    <div className="grid grid-cols-[90px_1fr] gap-2">
                      <dt className="text-white/50">Box</dt>
                      <dd className="text-white/80">{data.BoxOffice}</dd>
                    </div>
                  )}
                </dl>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

