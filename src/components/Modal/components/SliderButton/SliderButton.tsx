import classNames from 'classnames'
import { MouseEvent, RefObject, useEffect, useRef } from 'react'

import styles from './SliderButton.module.scss'

interface ISliderButton {
	items: Array<{ title: string; value: string }>
	setState: Function
	size?: string | null
}

export const SliderButton: React.FC<ISliderButton> = ({
	items,
	setState,
	size,
}: ISliderButton) => {
	const sliderRef = useRef<HTMLDivElement>(null)

	const sliderClickHandler = (
		e: MouseEvent<HTMLDivElement>,
		ref: RefObject<HTMLDivElement>
	) => {
		const reference = ref
		if (e.currentTarget.dataset.offset && reference.current) {
			reference.current.style.transform = `translate(calc(100% * ${+e.currentTarget
				.dataset.offset}))`
		}
	}

	useEffect(() => {
		if (size === 'small') {
			setState('normal')
			const div = document.querySelector('[data-value="normal"]') as HTMLDivElement

			if (div && div.previousElementSibling) {
				const prevDiv = div.previousElementSibling as HTMLDivElement
				prevDiv.style.transform = 'translate(0)'
			}
		}
	})

	return (
		<div className={classNames(styles.modalSliderBtn, styles.sliderBtn)}>
			<div
				className={classNames(styles.sliderBtnSlider)}
				style={{
					transform: items.length === 3 ? 'translateX(100%)' : 'translateX(0)',
					width: `${100 / items.length}%`,
				}}
				ref={sliderRef}
			/>
			{items.map((item, index) => {
				return (
					<div
						className={classNames(styles.sliderBtnItem, {
							[styles.disabled]: size === 'small' && item.value === 'thin',
						})}
						data-offset={index}
						data-value={item.value}
						key={item.title}
						onClick={e => {
							sliderClickHandler(e, sliderRef)
							setState(item.value)
						}}
					>
						<label>
							<span>{item.title}</span>
							<input type='radio' name='pizza-size' value={item.value.toLowerCase()} />
						</label>
					</div>
				)
			})}
		</div>
	)
}

SliderButton.defaultProps = {
	size: null,
}
