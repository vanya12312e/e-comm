import { Button, Space, Typography } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { logout } from '../../slices/authSlice'
import type { RootState } from '../../store/store'

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state: RootState) => state.auth)

  const onLogout = async () => {
    await dispatch(logout())
    navigate('/')
  }

  return (
    <header>
      <div
        className="w-full bg-[#001529] h-16 mb-4 flex items-center justify-between px-6"
        style={{ display: 'flex' }}
      >
        <Space size="large">
          <Link to="/" style={{ color: '#fff', fontWeight: 600 }}>
            Store
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" style={{ color: '#ffd666' }}>
              Admin
            </Link>
          )}
        </Space>
        <Space>
          {user ? (
            <>
              <Typography.Text style={{ color: '#fff' }}>
                {user.name ?? user.email} ({user.role})
              </Typography.Text>
              <Button size="small" onClick={onLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ color: '#fff' }}>
                Login
              </Link>
              <Link to="/register">
                <Button size="small" type="primary">
                  Sign up
                </Button>
              </Link>
            </>
          )}
        </Space>
      </div>
    </header>
  )
}

export default Header
