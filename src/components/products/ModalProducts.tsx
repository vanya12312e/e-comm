import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import { removeProductById } from '../../slices/productsSlice'
import type { RootState } from '../../store/store'

const ModalProducts = () => {

	const products = useAppSelector((state: RootState) => state.shoppingCart.products)

	const dispatch = useAppDispatch()

	return (
		<div>
			<div className='flex items-center gap-3 flex-wrap'>
				{products?.map((product) => {
					return (
						<div key={product.id}>
							<div className='flex flex-col items-center gap-3'>
								{product.thumbnail && (
									<img src={product.thumbnail} alt={product.title} width={120} height={120} />
								)}
								<p>{product.title}</p>
								<p>{product.price}$</p>
							</div>
							<button className='border border-red-600 rounded-2xl w-full px-2 py-0.5' onClick={() => {
								dispatch(removeProductById(product.id))
							}}>Remove From Cart</button>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default ModalProducts