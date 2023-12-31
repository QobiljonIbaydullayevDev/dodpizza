export interface Addons {
	id: number
	title: string
	img: string
	price: {
		small: number
		medium: number
		large: number
	}
}

export interface Ingredient {
	id: any
	title: string
	'data-optional': boolean
}

export interface Types {
	id?: any
	thin?: string
	normal?: string
}

export interface Nutrition {
	id?: any
	calories?: number
	proteins?: number
	fats?: number
	carbohydrates?: number
	weight?: number
	diameter?: number
}

export interface Sizes {
	id?: any
	small: {
		price: number
		imgs?: Types
		nutrition: {
			normal?: Nutrition
		}
	}
	medium: {
		price: number
		imgs?: Types
		nutrition: {
			thin?: Nutrition
			normal?: Nutrition
		}
	}
	large: {
		price: number
		imgs?: Types
		nutrition: {
			thin?: Nutrition
			normal?: Nutrition
		}
	}
}

interface ButtonType {
	title: string
	buttonStyle: {
		backgroundColor: string
		color: string
	}
}

export interface Product {
	id: number | string
	title: string
	img: string
	ingredients: number[]
	price: number
	sizes: Sizes
	totalPrice?: number
	description: string
	addons?: Array<any | boolean>
	buttonType?: ButtonType
}

export interface ComboProducts extends Product {
	products: Array<Array<any | number>>
}

export interface ComboProductTypes extends ComboProducts {
	realPrice: number
}

export interface ProductType {
	id: any
	title: string
	type: string
	products: Array<Product | ComboProducts>
}
