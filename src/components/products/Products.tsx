import { LoadingOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import { useEffect, useState } from 'react'
import type { IProductsResponse } from '../../interfaces'
import AddToCartButton from './AddToCartButton'

const { Meta } = Card

const Products = () => {

	const [isLoading, setIsLoading] = useState(true)

	const [products, setProducts] = useState<IProductsResponse>()

	useEffect(() => {
		fetch('https://dummyjson.com/products')
			.then((res) => {
				if (!res.ok) {
					throw new Error(`HTTP error: ${res.status}`)
				}
				return res.json()
			})
			.then(result => {
				setProducts(result)
				setIsLoading(true)

			})
			.catch((error) => {
				console.error('Помилка завантаження продуктів' + error)
				setIsLoading(false)
			})
			.finally(() => {
				setIsLoading(false)
			})
	}, [])
	return (
		<section className='w-full grid grid-cols-7 gap-3 p-4'>
			{isLoading ? <LoadingOutlined /> : products?.products.map(product => <Card
				key={product.id}
				variant="borderless"
				style={{ width: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
				cover={
					<img
						draggable={false}
						alt="example"
						src={product.thumbnail}
					/>
				}
			>
				<Meta title={product.title} description={product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description} />
				<AddToCartButton product={product} />
			</Card>)}
		</section>
	)
}
export default Products