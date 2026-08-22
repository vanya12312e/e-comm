export interface IProduct {
	id: number
	title: string
	description: string
	category: string
	price: number
	discountPercentage: number
	rating: number
	stock: number
	tags: string[]
	brand: string
	sku: string
	weight: number
	warrantyInformation: string
	shippingInformation: string
	availabilityStatus: string
	returnPolicy: string
	minimumOrderQuantity: number
	thumbnail: string
	hasInCart: boolean
}

export interface IProductsResponse {
	products: IProduct[]
	total: number
	skip: number
	limit: number
}