import { useAppDispatch, useAppSelector } from '../../hooks/hooks'
import type { IProduct } from '../../interfaces'
import { addProduct, removeProductById } from '../../slices/productsSlice'
import type { RootState } from '../../store/store'

interface AddToCartButtonProps {
	product: IProduct
}
const AddToCartButton = ({ product }: AddToCartButtonProps) => {
	// useAppDispatch — типизированный dispatch, через него отправляем экшены в стор
	const dispatch = useAppDispatch()

	// useAppSelector — подписка на стор.
	// Селектор отвечает на вопрос: «есть ли у меня в корзине товар с таким id?»
	// .some() возвращает boolean | undefined, а ?? false превращает результат в примитив boolean.
	// Примитив сравнивается по значению через ===, поэтому ререндер случится
	// ТОЛЬКО когда ответ реально изменился (false -> true или true -> false).
	const isInCart = useAppSelector((state: RootState) =>
		state.shoppingCart.products?.some(cartProduct => cartProduct.id === product.id) ?? false
	)

	const handleClick = () => {
		// Меняем состояние стора, а не локальный объект.
		// После dispatch() стор известит всех подписчиков, селектор пересчитается,
		// и кнопка перерисуется сама — вручную ререндер вызывать не нужно.
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