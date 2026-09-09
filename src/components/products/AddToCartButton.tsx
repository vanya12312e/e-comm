import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import type { IProduct } from '../../interfaces'
import { addProduct, removeProductById } from '../../slices/productsSlice'
import type { RootState } from '../../store/store'

interface AddToCartButtonProps {
	product: IProduct
}
const AddToCartButton = ({ product }: AddToCartButtonProps) => {
	const dispatch = useAppDispatch()
	const isInCart = useAppSelector((state: RootState) =>
		state.shoppingCart.products?.some(cartProduct => cartProduct.id === product.id) ?? false
	)

	const handleClick = () => {
		if (isInCart) {
			dispatch(removeProductById(product.id))
		} else {
			dispatch(addProduct(product))
		}
	}

	return (
		<button
			className='bg-white border rounded-2xl flex items-center justify-center w-full mt-3'
			style={{ borderColor: isInCart ? 'red' : 'green' }}
			onClick={handleClick}
		>
			{isInCart ? 'Remove From Cart' : 'Add to Cart'}
		</button>
	)
}

export default AddToCartButton