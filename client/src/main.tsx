import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import  "./assets/css/App.css"
import GameLanding from "@/components/pages/GameLanding.tsx";
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GameLanding/>
  </StrictMode>,
)
