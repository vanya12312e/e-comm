import { App as AntdApp } from 'antd'
import { Route, Routes } from 'react-router-dom'
import { AdminGuard, ProtectedRoute } from './components/auth/Guards'
import Header from './components/header/Header'
import AdminPage from './pages/AdminPage'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <AntdApp>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Private area: check session first, then role */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminGuard />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
    </AntdApp>
  )
}

export default App
