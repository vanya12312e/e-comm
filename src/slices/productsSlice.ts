import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import type { IProduct } from '../interfaces'

export interface ShoppingCartState {
	products: IProduct[] | null
	length: number
}

const initialState: ShoppingCartState = {
	products: null,
	length: 0
}

export const shoppingCartSlice = createSlice({
	name: 'shoppingCart',
	initialState,
	reducers: {
		addProduct: (state, action: PayloadAction<IProduct>) => {
			if (!state.products) {
				state.products = []
			}
			state.products.push(action.payload)
			state.length = state.products.length
			console.log('Added to cart: ' + action.payload.title)
		},
		removeProductById: (state, action: PayloadAction<number>) => {
			if (state.products) {
				state.products = state.products.filter((product) =>
					product.id !== action.payload,
				)

				state.length = state.products.length
			}
		},
	},
})

export const { addProduct, removeProductById } = shoppingCartSlice.actions

export default shoppingCartSlice.reducer