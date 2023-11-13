import classNames from 'classnames'
import { MouseEvent, useEffect, useState } from 'react'
import { formatPrice } from 'utils'

import styles from './AddonCard.module.scss'

export interface IAddonCardProps {
	img: string
	title: string
	price: any
	size: string
	priceState: [number, Function]
}

export const AddonCard: React.FC<IAddonCardProps> = ({
	img,
	price,
	title,
	size,
	priceState,
}: IAddonCardProps) => {
	const [isSelected, setIsSelected] = useState(false)
	const [itemPrice, setItemPrice] = priceState
	const priceCalcHandler = (e: MouseEvent<HTMLDivElement>) => {
		if (e.currentTarget.dataset.price) {
			const addonPrice = +e.currentTarget.dataset.price
			if (!isSelected) {
				setItemPrice(itemPrice + addonPrice)
			} else {
				setItemPrice(itemPrice - addonPrice)
			}
		}
	}

	return (
		<div
			className={classNames(styles.addonsCard, {
				[styles.addonsCardSelected]: isSelected,
			})}
			data-price={price[size]}
			data-selected={isSelected}
			onClick={e => {
				setIsSelected(!isSelected)
				priceCalcHandler(e)
			}}
		>
			<img src={img} alt={title} className={styles.addonCardImage} />
			<h6 className={styles.addonCardTitle}>{title}</h6>
			<p className={styles.addonCardPrice}>{formatPrice(price[size])} сум</p>
		</div>
	)
}
