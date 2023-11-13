import classNames from 'classnames'
import { ADDONS, INGREDIENTS } from 'constants/dataBase/'
import { Product, Sizes } from 'constants/dataBase/interfces'
import { DOUGH_TYPES, IDoughTypes, ISizes, SIZES } from 'constants/index'
import React, { useEffect, useState } from 'react'
import { capitalize, formatPrice } from 'utils'

import styles from './Modal.module.scss'
import { AddonCard } from './components/AddonCard'
import { SliderButton } from './components/SliderButton'

export interface IModalProps {
	isModalOpen: boolean
	setIsModalOpen: Function
	product: Product | undefined
}

export const Modal: React.FC<IModalProps> = ({
	isModalOpen,
	setIsModalOpen,
	product,
}: IModalProps) => {
	const [size, setSize] = useState<string>('medium')
	const [doughType, setDoughType] = useState<string>('normal')
	const [price, setPrice] = useState<number>(0)

	const [sliderButtonKey1, setSliderButtonKey1] = useState(Math.random())
	const [sliderButtonKey2, setSliderButtonKey2] = useState(Math.random())
	const [addonsConatainerKey, setAddonsConatainerKey] = useState(Math.random())

	const modalCloseHandler = (): void => {
		setIsModalOpen(false)
		setSize('medium')
		setDoughType('normal')
		setSliderButtonKey1(Math.random())
		setSliderButtonKey2(Math.random())
		setAddonsConatainerKey(Math.random())

		if (product) {
			setPrice(product.sizes.medium.price)
		}
	}

	const recalculatePrice = () => {
		const selectedAddons = document.querySelectorAll(
			'[data-selected="true"]'
		) as NodeListOf<HTMLDivElement>

		const prices: string[] = []
		selectedAddons.forEach((selectedAddon: HTMLDivElement) => {
			if (selectedAddon.dataset.selected && selectedAddon.dataset.price) {
				prices.push(selectedAddon.dataset.price)
			}
		})

		if (product) {
			const sum = prices.reduce((a, b) => {
				return +a + +b
			}, product.sizes[size as keyof Sizes].price)
			setPrice(sum)
		}
	}

	useEffect(() => {
		if (product && price === 0) {
			setPrice(+product.sizes[size as keyof Sizes].price)
		}
	})

	useEffect(() => {
		recalculatePrice()
	}, [size])

	useEffect(() => {
		if (isModalOpen) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = ''
		}
	})

	return product ? (
		<>
			<div
				className={classNames(styles.modal, styles.modalMedium, {
					[styles.modalActive]: isModalOpen,
				})}
			>
				<button
					className={styles.modalClose}
					type='button'
					onClick={modalCloseHandler}
					tabIndex={-1}
				>
					<img src='modal_close.svg' alt='Close button' />
				</button>
				<div className={styles.modalLeft}>
					<div
						className={classNames(styles.modalLeftContainer, {
							[styles.small]: size === 'small',
							[styles.medium]: size === 'medium',
							[styles.large]: size === 'large',
						})}
					>
						<img src={product.sizes[size as keyof Sizes].imgs[doughType]} alt='' />
					</div>
				</div>
				<div className={styles.modalRight}>
					<div className={styles.modalScroll}>
						<h4 className={styles.modalTitle}>{product.title}</h4>
						<p className={classNames(styles.modalInfo, styles.info)}>
							<span className={styles.infoSize} id='info_size'>
								{SIZES[size as keyof ISizes].size} см
							</span>
							,&nbsp;
							<span className={styles.infoDoughType} id='info_dough_type'>
								{DOUGH_TYPES[doughType as keyof IDoughTypes].title} тесто
							</span>
						</p>
						<ul
							className={classNames(styles.modalIngredientList, styles.ingredientList)}
						>
							{product.ingredients.map((indredientId, index, arr) => {
								const ingredient = INGREDIENTS[indredientId - 1]
								return (
									<React.Fragment key={Math.random()}>
										<li
											className={styles.ingredientListItem}
											data-optional={ingredient['data-optional']}
											data-removed='false'
											onClick={e => {
												if (
													e.currentTarget &&
													e.currentTarget.dataset.removed &&
													e.currentTarget.dataset.optional === 'true'
												) {
													e.currentTarget.dataset.removed = String(
														!JSON.parse(e.currentTarget.dataset.removed)
													)
												}
											}}
										>
											<span>
												{!index ? capitalize(ingredient.title) : ingredient.title}
											</span>
										</li>
										{arr.length - 1 !== index && ','}
									</React.Fragment>
								)
							})}
						</ul>
						<SliderButton
							items={[
								{ title: 'Маленькая', value: 'small' },
								{ title: 'Средняя', value: 'medium' },
								{ title: 'Большая', value: 'large' },
							]}
							setState={setSize}
							key={sliderButtonKey1}
						/>
						<SliderButton
							items={[
								{ title: 'Традиционное', value: 'normal' },
								{ title: 'Тонкое', value: 'thin' },
							]}
							setState={setDoughType}
							size={size}
							key={sliderButtonKey2}
						/>

						<div className={styles.addons}>
							{product.addons && (
								<h5 className={styles.addonsTitle}>Добавить в пиццу</h5>
							)}
							<div className={styles.addonsList} key={addonsConatainerKey}>
								{product.addons &&
									product.addons.map(addonTitle => {
										const addon = ADDONS.find(add => {
											return add.title === addonTitle
										})
										if (addon) {
											return (
												<AddonCard
													{...addon}
													size={size}
													priceState={[price, setPrice]}
													key={addonTitle}
												/>
											)
										}
										return null
									})}
							</div>
						</div>
					</div>

					<div className={styles.modalCardBtnContainer}>
						<button className={styles.modalCardBtn} type='button' tabIndex={-1}>
							Добавить в корзину за {formatPrice(price)} сум
						</button>
					</div>
				</div>
			</div>
			<div className={styles.modalBg} onClick={modalCloseHandler} />
		</>
	) : null
}
