import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { App as AntdApp, Button, Form, Image, Input, InputNumber, Modal, Popconfirm, Space, Table, Typography } from 'antd'
import { useCallback, useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../api/client'
import type { IProduct, IProductsResponse } from '../interfaces'

interface ProductForm {
  title: string
  description: string
  price: number
  thumbnail?: string
  brand?: string
  category?: string
}

const fetchProducts = async (): Promise<IProduct[]> => {
  const { data } = await api.get<IProductsResponse>('/products')
  return data.products
}

const emptyForm: ProductForm = {
  title: '',
  description: '',
  price: 0,
  thumbnail: '',
  brand: '',
  category: '',
}

const AdminPage = () => {
  const { message } = AntdApp.useApp()
  const [products, setProducts] = useState<IProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<IProduct | null>(null)
  const [saving, setSaving] = useState(false)
  const [form] = Form.useForm<ProductForm>()

  const load = useCallback(async () => {
    setLoading(true)
    try {
      setProducts(await fetchProducts())
    } catch (e) {
      message.error(apiErrorMessage(e, 'Failed to load products'))
    } finally {
      setLoading(false)
    }
  }, [message])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      try {
        const list = await fetchProducts()
        if (!cancelled) setProducts(list)
      } catch (e) {
        if (!cancelled) message.error(apiErrorMessage(e, 'Failed to load products'))
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [message])

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue(emptyForm)
    setModalOpen(true)
  }

  const openEdit = (p: IProduct) => {
    setEditing(p)
    form.setFieldsValue({
      title: p.title,
      description: p.description,
      price: p.price,
      thumbnail: p.thumbnail ?? '',
      brand: p.brand ?? '',
      category: p.category ?? '',
    })
    setModalOpen(true)
  }

  const onSave = async (values: ProductForm) => {
    setSaving(true)
    try {
      if (editing) {
        await api.put(`/products/${editing.id}`, values)
        message.success('Product updated')
      } else {
        await api.post('/products', values)
        message.success('Product added')
      }
      setModalOpen(false)
      await load()
    } catch (e) {
      message.error(apiErrorMessage(e, 'Failed to save'))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (id: number) => {
    try {
      await api.delete(`/products/${id}`)
      message.success('Product deleted')
      await load()
    } catch (e) {
      message.error(apiErrorMessage(e, 'Failed to delete'))
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 1200, margin: '0 auto' }}>
      <Space style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Typography.Title level={3} style={{ margin: 0 }}>
          Admin: products ({products.length})
        </Typography.Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          Add product
        </Button>
      </Space>

      <Table<IProduct>
        rowKey="id"
        loading={loading}
        dataSource={products}
        pagination={{ pageSize: 10 }}
        columns={[
          {
            title: 'Photo',
            dataIndex: 'thumbnail',
            width: 90,
            render: (src: string | null) =>
              src ? <Image src={src} width={56} height={56} style={{ objectFit: 'cover' }} /> : '—',
          },
          { title: 'Title', dataIndex: 'title' },
          {
            title: 'Price',
            dataIndex: 'price',
            width: 110,
            render: (v: number) => `${Number(v).toFixed(2)}$`,
            sorter: (a, b) => a.price - b.price,
          },
          { title: 'Category', dataIndex: 'category', width: 140, render: (v: string | null) => v ?? '—' },
          {
            title: 'Actions',
            width: 160,
            render: (_, p) => (
              <Space>
                <Button icon={<EditOutlined />} onClick={() => openEdit(p)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete product?"
                  description={p.title}
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => onDelete(p.id)}
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title={editing ? `Edit #${editing.id}` : 'New product'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form<ProductForm> form={form} layout="vertical" onFinish={onSave} preserve={false}>
          <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Enter a title' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Add a description' }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Space style={{ display: 'flex' }} size="middle">
            <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Enter a price' }]}>
              <InputNumber min={0.01} step={0.01} precision={2} style={{ width: '100%' }} />
            </Form.Item>
          </Space>
          <Form.Item label="Image (URL)" name="thumbnail">
            <Input placeholder="https://..." />
          </Form.Item>
          <Space style={{ display: 'flex' }} size="middle">
            <Form.Item label="Brand" name="brand" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
            <Form.Item label="Category" name="category" style={{ flex: 1 }}>
              <Input />
            </Form.Item>
          </Space>
          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={saving}>
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default AdminPage
