import React from 'react'
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

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyAuthProvider>
      <App />
    </PrivyAuthProvider>
  </React.StrictMode>,
)