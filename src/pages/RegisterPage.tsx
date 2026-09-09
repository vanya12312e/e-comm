import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../hooks/hooks'
import { clearError, register } from '../slices/authSlice'
import type { RootState } from '../store/store'

interface RegisterForm {
  name?: string
  email: string
  password: string
}

const RegisterPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user, status, error } = useAppSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(clearError())
  }, [dispatch])

  useEffect(() => {
    if (user) navigate(user.role === 'ADMIN' ? '/admin' : '/', { replace: true })
  }, [user, navigate])

  const onFinish = (values: RegisterForm) => {
    dispatch(register(values))
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px' }}>
      <Card title="Sign up" style={{ width: 400 }}>
        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}
        <Form<RegisterForm> layout="vertical" onFinish={onFinish}>
          <Form.Item label="Name" name="name" rules={[{ max: 50, message: 'Max 50 characters' }]}>
            <Input prefix={<UserOutlined />} placeholder="Your name" autoComplete="name" />
          </Form.Item>
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
            rules={[{ required: true, message: 'Create a password' }, { min: 6, message: 'Minimum 6 characters' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Minimum 6 characters" autoComplete="new-password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={status === 'loading'}>
              Create account
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary">
          Already have an account? <Link to="/login">Login</Link>
        </Typography.Text>
      </Card>
    </div>
  )
}

export default RegisterPage
