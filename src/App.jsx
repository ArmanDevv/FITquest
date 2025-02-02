import { useState } from 'react'
import Home from './components/home/home'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Singin from './components/Singin'

function App() {
  const [count, setCount] = useState(0)

  return (
   
   
  <div className='flex flex-col bg-gradient-to-r from-black via-teal-950 to-black text-white h-screen min-h-screen'>
      <Navbar/>
     <Home/>
     <Singin/>
      <Footer/>
      </div>

    
    
    
   
    
    
  )
}

export default App
