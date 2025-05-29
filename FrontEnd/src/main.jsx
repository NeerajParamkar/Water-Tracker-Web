import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import{Route, RouterProvider} from 'react-router-dom'
// import App from './App.jsx'
import router from './App'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
