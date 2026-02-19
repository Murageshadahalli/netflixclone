export type OmdbType = 'movie' | 'series' | 'episode'

export type OmdbSearchItem = {
  Title: string
  Year: string
  imdbID: string
  Type: OmdbType
  Poster: string
}

export type OmdbSearchResponse =
  | {
      Response: 'True'
      Search: OmdbSearchItem[]
      totalResults: string
    }
  | {
      Response: 'False'
      Error: string
    }

export type OmdbTitleResponse =
  | ({
      Response: 'True'
    } & Record<string, string>)
  | {
      Response: 'False'
      Error: string
    }

const OMDB_BASE_URL = 'https://www.omdbapi.com/'

function getApiKey() {
  const key = import.meta.env.VITE_OMDB_API_KEY as string | undefined
  if (!key) {
    throw new Error('Missing VITE_OMDB_API_KEY (set it in .env.local)')
  }
  return key
}

async function fetchOmdb<T>(
  params: Record<string, string | number | undefined>,
  signal?: AbortSignal,
): Promise<T> {
  const url = new URL(OMDB_BASE_URL)
  url.searchParams.set('apikey', getApiKey())
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue
    url.searchParams.set(k, String(v))
  }

  const res = await fetch(url, { signal })
  if (!res.ok) {
    throw new Error(`OMDb request failed: ${res.status} ${res.statusText}`)
  }
  return (await res.json()) as T
}

export async function searchTitles(
  query: string,
  opts?: { page?: number; type?: OmdbType; signal?: AbortSignal },
): Promise<OmdbSearchResponse> {
  const q = query.trim()
  if (!q) {
    return { Response: 'False', Error: 'Empty query' }
  }
  return await fetchOmdb<OmdbSearchResponse>(
    { s: q, page: opts?.page ?? 1, type: opts?.type },
    opts?.signal,
  )
}

export async function getTitleByImdbId(
  imdbID: string,
  opts?: { plot?: 'short' | 'full'; signal?: AbortSignal },
): Promise<OmdbTitleResponse> {
  return await fetchOmdb<OmdbTitleResponse>(
    { i: imdbID, plot: opts?.plot ?? 'full' },
    opts?.signal,
  )
}

