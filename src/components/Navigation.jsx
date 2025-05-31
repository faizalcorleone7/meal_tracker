import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, History, TrendingUp, User } from 'lucide-react'

const Navigation = () => {
  const location = useLocation()
  
  const navItems = [
    { path: '/today', label: 'Today', icon: Calendar },
    { path: '/history', label: 'History', icon: History },
    { path: '/trends', label: 'Trends', icon: TrendingUp },
    { path: '/profile', label: 'Profile', icon: User }
  ]

  // Don't show navigation on log-meal screen
  if (location.pathname === '/log-meal') {
    return null
  }

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e2e8f0',
      padding: '0.5rem 0',
      zIndex: 1000
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location.pathname === path
          
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '0.5rem',
                textDecoration: 'none',
                color: isActive ? '#3b82f6' : '#64748b',
                transition: 'color 0.2s'
              }}
            >
              <Icon size={24} />
              <span style={{
                fontSize: '0.75rem',
                marginTop: '0.25rem',
                fontWeight: isActive ? '600' : '400'
              }}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default Navigation 