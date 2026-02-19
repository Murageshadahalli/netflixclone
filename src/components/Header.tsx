import { NavLink, useNavigate } from 'react-router-dom'
import { User, LogOut, UserPlus } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

function HeaderLink({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        [
          'text-sm font-medium transition',
          isActive ? 'text-white' : 'text-white/70 hover:text-white',
        ].join(' ')
      }
    >
      {label}
    </NavLink>
  )
}

export function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/60 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="grid h-7 w-7 place-items-center rounded bg-red-600 text-sm font-black">
            N
          </div>
          <span className="hidden text-sm font-semibold tracking-wide text-white sm:block">
            netflixclone
          </span>
        </NavLink>

        {user && (
          <nav className="flex items-center gap-4">
            <HeaderLink to="/" label="Home" />
            <HeaderLink to="/my-list" label="My List" />
          </nav>
        )}

        <div className="ml-auto flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-white/70">
                <User className="h-4 w-4" />
                <span className="text-xs">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NavLink
                to="/login"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <span className="text-xs">Sign In</span>
              </NavLink>
              <NavLink
                to="/signup"
                className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span className="text-xs hidden sm:inline">Sign Up</span>
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

