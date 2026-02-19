import type { OmdbSearchItem } from '../lib/omdb'

const FALLBACK_POSTER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#111827"/>
          <stop offset="1" stop-color="#000000"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9CA3AF" font-family="Arial" font-size="28">
        No poster
      </text>
    </svg>`,
  )

export function TitleCard({
  item,
  onOpen,
}: {
  item: OmdbSearchItem
  onOpen: (imdbID: string) => void
}) {
  const poster = item.Poster && item.Poster !== 'N/A' ? item.Poster : FALLBACK_POSTER

  return (
    <button
      onClick={() => onOpen(item.imdbID)}
      className="group w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left transition hover:scale-[1.02] hover:border-white/20 hover:bg-white/10"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-black/40">
        <img
          src={poster}
          alt={item.Title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-3">
        <div className="truncate text-sm font-semibold text-white">{item.Title}</div>
        <div className="mt-1 text-xs text-white/60">
          {item.Year} · {item.Type.toUpperCase()}
        </div>
      </div>
    </button>
  )
}

