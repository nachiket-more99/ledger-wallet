import { Routes, Route } from 'react-router-dom'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { AppLayout } from './layouts/AppLayout'
import { Transactions } from './pages/Transactions'


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/transactions' element={<Transactions />} />
      </Route>
    </Routes>
  )
}

export default App