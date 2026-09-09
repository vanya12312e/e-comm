import { ShoppingCartOutlined } from '@ant-design/icons/es/icons/index'
import { FloatButton, Modal } from 'antd'
import { useState } from 'react'
import ModalProducts from '../components/products/ModalProducts'
import Products from '../components/products/Products'
import { useAppSelector } from '../hooks/hooks'
import type { RootState } from '../store/store'

function HomePage() {

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
        title="Cart"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={<p>Total price: {(products.products?.reduce((total, product) => total + product.price, 0) ?? 0).toFixed(2)}$</p>}
      >
        <ModalProducts />
      </Modal>
      <Products />
      <FloatButton.Group shape="circle">
        <FloatButton
          badge={{ count: cartLength }}
          style={{ width: 50, height: 50 }}
          icon={<ShoppingCartOutlined />}
          onClick={showModal}
        />
      </FloatButton.Group>
    </>
  )
}
export default HomePage
