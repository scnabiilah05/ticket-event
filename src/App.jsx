import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Homepage from './pages/Homepage'
import './App.css'
import { EventDetailPage } from './pages/EventDetailPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/:detail" element={<EventDetailPage />} />
      </Routes>
    </Router>
  )
}

export default App
