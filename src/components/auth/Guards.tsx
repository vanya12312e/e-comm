import { Spin } from 'antd'
import { useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { fetchMe } from '../../slices/authSlice'
import type { RootState } from '../../store/store'

function useSession() {
  const dispatch = useAppDispatch()
  const { user, status } = useAppSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (status === 'idle') dispatch(fetchMe())
  }, [status, dispatch])

  return { user, loading: status === 'idle' || status === 'loading' }
}

const centered = (
  <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
    <Spin size="large" />
  </div>
)

// Private route: no session -> /login
export const ProtectedRoute = () => {
  const { user, loading } = useSession()
  const location = useLocation()
  if (loading) return centered
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return <Outlet />
}

// ADMIN only: regular USER -> /
export const AdminGuard = () => {
  const { user, loading } = useSession()
  if (loading) return centered
  if (user?.role !== 'ADMIN') return <Navigate to="/" replace />
  return <Outlet />
}
