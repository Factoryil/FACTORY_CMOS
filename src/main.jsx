import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' 
import Routers from './routers/Routers'
createRoot(document.getElementById('root')).render(
  // <StrictMode>
      <BrowserRouter>
          <Routers />
      </BrowserRouter>
  // </StrictMode>
    
)

