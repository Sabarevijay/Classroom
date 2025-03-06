import React from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import AdminOTP from './Pages/AdminOTP'
import UserOTP from './Pages/UserOTP'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/generate' element={<AdminOTP />} />
        <Route path='/submit' element={<UserOTP />} />
      </Routes>    
    </BrowserRouter>
  )
}

export default App
