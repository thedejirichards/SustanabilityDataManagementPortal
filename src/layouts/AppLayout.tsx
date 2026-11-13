import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import { UserProvider } from '../context/UserContext'
import { UsersProvider } from '../context/UsersProvider'
import { SustainabilityProvider } from '../context/SustainabilityProvider'

export default function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    try {
      return window.localStorage.getItem('sdm.theme') === 'dark'
    } catch {
      return false
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem('sdm.theme', darkMode ? 'dark' : 'light')
    } catch {
      // Theme preference is optional; ignore storage failures.
    }
  }, [darkMode])

  return (
    <UsersProvider>
      <UserProvider>
        <SustainabilityProvider>
        <div className={`app-shell flex min-h-screen bg-slate-50 text-slate-900 ${darkMode ? 'app-dark' : ''}`}>
          <Sidebar mobileOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
          <div className="flex min-w-0 flex-1 flex-col">
            <Header onMenuClick={() => setMobileNavOpen(true)} darkMode={darkMode} onToggleDarkMode={() => setDarkMode((current) => !current)} />
            <main className="w-full flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <div className="mx-auto w-full max-w-[1440px]">
                <Outlet />
                <footer className="mt-12 flex flex-col gap-1 border-t border-slate-200 py-5 text-[10px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                  <span>Access Holdings · Sustainability Data Management Portal</span>
                  <span>Demonstration workspace · Data is illustrative</span>
                </footer>
              </div>
            </main>
          </div>
        </div>
      </SustainabilityProvider>
      </UserProvider>
    </UsersProvider>
  )
}
