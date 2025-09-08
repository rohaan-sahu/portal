import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrivyAuthProvider } from './PrivyAuth.jsx'

// Polyfill buffer and util for browser compatibility
import { Buffer } from 'buffer'
import util from 'util'

window.Buffer = Buffer
window.util = util

// Polyfill process for browser compatibility
window.process = {
  env: {},
  version: '',
  browser: true
}

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-blue mx-auto mb-4"></div>
      <p className="text-white text-lg font-orbitron">Loading Playrush...</p>
    </div>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={<LoadingSpinner />}>
      <PrivyAuthProvider>
        <App />
      </PrivyAuthProvider>
    </Suspense>
  </React.StrictMode>,
)
