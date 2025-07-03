import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import CropStatus from './pages/farmstatus/CropStatus'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <CropStatus/>
    </>
  )
}

export default App
