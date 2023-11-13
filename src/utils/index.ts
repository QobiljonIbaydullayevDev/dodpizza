export const capitalize = (word: string) => {
	return word.charAt(0).toUpperCase() + word.slice(1)
}

export const formatPrice = (price: number): string => {
	return `${price / 1000} 000`
}
