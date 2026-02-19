import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { SignUp } from './pages/SignUp'
import { MyList } from './pages/MyList'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-full bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(220,38,38,0.35),transparent),radial-gradient(900px_500px_at_90%_0%,rgba(255,255,255,0.08),transparent)]">
          <Header />
          <main>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/my-list" element={
                <ProtectedRoute>
                  <MyList />
                </ProtectedRoute>
              } />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-white/10 bg-black/30">
            <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
              <div>Built with React + OMDb</div>
              <div>Not affiliated with Netflix</div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  )
}
