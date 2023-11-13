import { Modal, ProductCard, ProductsWrapper } from 'components'
import { PIZZAS } from 'constants/dataBase'
import { Product } from 'constants/dataBase/interfces'
import { useState } from 'react'

export const HomePage = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState<Product>()
	return (
		<>
			<Modal
				isModalOpen={isModalOpen}
				setIsModalOpen={setIsModalOpen}
				product={selectedProduct}
			/>
			<ProductsWrapper>
				{PIZZAS.map(product => (
					<ProductCard
						product={product}
						key={product.id}
						setIsModalOpen={setIsModalOpen}
						setSelectedProduct={setSelectedProduct}
					/>
				))}
			</ProductsWrapper>
		</>
	)
}
