// ============================================================
// main.jsx — React App Entry Point
// ============================================================
// This is the first file that runs when the app starts
// It mounts the React app into the <div id="root"> in index.html
//
// NOTE: AuthProvider is NOT here — it lives inside App.jsx
// because AuthProvider uses useNavigate() which requires
// BrowserRouter to be set up first (BrowserRouter is in App.jsx)
// ============================================================

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Mount the React app into the root div
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
