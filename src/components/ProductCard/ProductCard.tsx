import { Product } from 'constants/dataBase/products/product'

import styles from './ProductCard.module.scss'

export interface IProductCardProps {
	product: Product
	setIsModalOpen: Function
	setSelectedProduct: Function
}

export const ProductCard: React.FC<IProductCardProps> = ({
	product,
	setIsModalOpen,
	setSelectedProduct,
}: IProductCardProps) => {
	const openModalHandler = (): void => {
		setIsModalOpen(true)
	}

	return (
		<div
			className={styles.card}
			onClick={() => {
				openModalHandler()
				setSelectedProduct(product)
			}}
		>
			<div className={styles.card_body}>
				<img
					src={product.img}
					alt='Маргарита'
					className={styles.card_img}
					width='221'
				/>
				<h3 className={styles.card_title}>{product.title}</h3>
				<p className={styles.card_text}>
					Соус сырный, сыр моцарелла, цыпленок, томаты
				</p>
			</div>
			<div className={styles.card_footer}>
				<p className={styles.card_price}>от {`${product.price / 1000} 000`} сум</p>
				<div className={styles.card_button_wrapper}>
					<button className={styles.card_button} type='button'>
						Выбрать
					</button>
				</div>
			</div>
		</div>
	)
}
