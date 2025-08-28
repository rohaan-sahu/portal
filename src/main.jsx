import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { PrivyAuthProvider } from './PrivyAuth.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PrivyAuthProvider>
      <App />
    </PrivyAuthProvider>
  </React.StrictMode>,
)