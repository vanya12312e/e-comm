import { LockOutlined, MailOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { clearError, login } from '../slices/authSlice'
import type { RootState } from '../store/store'

interface LoginForm {
  email: string
  password: string
}

const LoginPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, status, error } = useAppSelector((state: RootState) => state.auth)
  const from = (location.state as { from?: string } | null)?.from ?? '/'

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' && from === '/' ? '/admin' : from, { replace: true })
  }, [user, navigate, from])

  const onFinish = (values: LoginForm) => {
    dispatch(login(values))
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
      <Card title="Login" style={{ width: 400 }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        <Form<LoginForm> layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Enter your email' }, { type: 'email', message: 'Invalid email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="you@mail.com" autoComplete="email" />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Enter your password' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="••••••" autoComplete="current-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={status === 'loading'}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary">
          No account? <Link to="/register">Sign up</Link>
        </Typography.Text>
      </Card>
    </div>
  )
}

export default LoginPage
