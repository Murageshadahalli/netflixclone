import { useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = 'Search movies, series, episodes…',
}: {
  value: string
  onChange: (next: string) => void
  onSubmit?: () => void
  placeholder?: string
}) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        e.preventDefault()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <form
      className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit?.()
      }}
    >
      <Search className="h-4 w-4 text-white/70" />
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
      />
      {value.trim().length > 0 && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="rounded-md p-1 text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  )
}

