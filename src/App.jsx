import { Outlet } from 'react-router'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthProvider from './context/AuthProvider' 
import Banner from './components/Banner'
import WhyDonate from './components/WhyDonate'

function App() {
  return (
    <AuthProvider> 
      <Navbar  />
      <div className="min-h-[calc(100vh-120px)]">
        <Banner></Banner>
        <WhyDonate></WhyDonate>
        <Outlet />
      </div>
      <Footer />
    </AuthProvider>
  )
}

export default App