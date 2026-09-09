import { configureStore } from '@reduxjs/toolkit'
import authReducer from './../slices/authSlice'
import cartReducer from './../slices/productsSlice'

export const store = configureStore({
	reducer: {
		shoppingCart: cartReducer,
		auth: authReducer,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch