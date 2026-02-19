import { useMemo, useState } from 'react'
import { TitleCard } from '../components/TitleCard'
import { TitleDetailsModal } from '../components/TitleDetailsModal'
import { useWatchlist } from '../hooks/useWatchlist'
import type { OmdbSearchItem } from '../lib/omdb'

export function MyList() {
  const { items } = useWatchlist()
  const [openId, setOpenId] = useState<string | null>(null)

  const cards = useMemo<OmdbSearchItem[]>(
    () =>
      items.map((x) => ({
        Title: x.title,
        Year: x.year ?? '',
        imdbID: x.imdbID,
        Type: (x.type as OmdbSearchItem['Type']) ?? 'movie',
        Poster: x.poster ?? 'N/A',
      })),
    [items],
  )

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white">My List</h1>
          <p className="mt-2 text-sm text-white/60">
            {items.length.toLocaleString()} saved title(s)
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          Your list is empty. Go to Home and add a few titles.
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {cards.map((item) => (
            <TitleCard key={item.imdbID} item={item} onOpen={setOpenId} />
          ))}
        </div>
      )}

      {openId && <TitleDetailsModal imdbID={openId} onClose={() => setOpenId(null)} />}
    </div>
  )
}

