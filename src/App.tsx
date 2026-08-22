import { ShoppingCartOutlined } from '@ant-design/icons/es/icons/index'
import { ConfigProvider, FloatButton, Modal } from 'antd'
import { useState } from 'react'
import './App.css'
import Header from './components/header/Header'
import ModalProducts from './components/products/ModalProducts'
import Products from './components/products/Products'
import { useAppSelector } from './hooks/hooks'
import type { RootState } from './store/store'


function App() {

  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const cartLength = useAppSelector((state: RootState) => state.shoppingCart.length)
  const products = useAppSelector((state: RootState) => state.shoppingCart)

  return (
    <>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<p>total price: {(products.products?.reduce((total, product) => total + product.price, 0) ?? 0).toFixed(2)}$</p>}
      >
        <ModalProducts />
      </Modal>
      <Header />
      <Products />
      <ConfigProvider theme={{
        token: {
          colorPrimary: '#ff4d4f'
        }
      }}>
        <FloatButton.Group shape="circle">
          <FloatButton
            badge={{ count: cartLength }}
            style={{ width: 50, height: 50 }}
            icon={<ShoppingCartOutlined />}
            onClick={showModal}
          />
        </FloatButton.Group>
      </ConfigProvider>
    </>
  )
}

export default App
