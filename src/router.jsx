import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import { EventDetailPage } from './pages/EventDetailPage'
import ComingSoonPage from './pages/ftl-universe/pages/ComingSoonPage'
import React from 'react'
import RegistrationPages from './pages/ftl-universe/pages/RegistrationPages'

const routes = [
    {
        path: '/',
        name: 'homepage',
        component: Homepage,
        meta: {
            title: 'FTL Event'
        }
    },
    {
        path: '/:id',
        name: 'event-detail',
        component: EventDetailPage,
        meta: {
            title: 'FTL Event Detail'
        }
    },
    {
        path: '/coming-soon',
        name: 'coming-soon',
        component: ComingSoonPage,
        meta: {
            title: 'Coming Soon - FTL Universe'
        }
    },

    //ftl-universe
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationPages,
      meta: {
        title: 'Registration'
      }
    }
]

export function AppRouter() {
  return (
    <Router>
      <Routes>
        {routes.map((route) => (

          <Route key={route?.path} path={route?.path} element={React.createElement(route?.component)} />
        ))}
      </Routes>
    </Router>
  )
}

export { routes }
