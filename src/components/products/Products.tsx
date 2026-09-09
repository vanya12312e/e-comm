import { LoadingOutlined } from '@ant-design/icons'
import { Alert, Card } from 'antd'
import { useEffect, useState } from 'react'
import { api, apiErrorMessage } from '../../api/client'
import type { IProductsResponse } from '../../interfaces'
import AddToCartButton from './AddToCartButton'

const { Meta } = Card

const Products = () => {

	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const [products, setProducts] = useState<IProductsResponse>()

	useEffect(() => {
		let cancelled = false
		api.get<IProductsResponse>('/products')
			.then((result) => {
				if (!cancelled) {
					setProducts(result.data)
					setError(null)
				}
			})
			.catch((error) => {
				if (!cancelled) {
					console.error('Failed to load products: ' + error)
					setError(apiErrorMessage(error, 'API unavailable. Start the backend: npm run server:dev'))
				}
			})
			.finally(() => {
				if (!cancelled) setIsLoading(false)
			})
		return () => {
			cancelled = true
		}
	}, [])

	if (error) {
		return (
			<section className='w-full p-4' style={{ maxWidth: 720 }}>
				<Alert
					type="error"
					message="Failed to load products"
					description={error}
					showIcon
				/>
			</section>
		)
	}

	return (
		<section className='w-full grid grid-cols-7 gap-3 p-4'>
			{isLoading ? <LoadingOutlined /> : products?.products.map(product => <Card
				key={product.id}
				variant="borderless"
				style={{ width: 240, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
				cover={
					product.thumbnail ? (
						<img
							draggable={false}
							alt="example"
							src={product.thumbnail}
						/>
					) : undefined
				}
			>
				<Meta title={product.title} description={product.description.length > 100 ? product.description.slice(0, 100) + '...' : product.description} />
				<Meta title={`$${product.price}`} />
				<AddToCartButton product={product} />
			</Card>)}
		</section>
	)
}
export default Products
