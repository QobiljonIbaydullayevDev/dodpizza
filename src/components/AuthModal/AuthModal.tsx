import axios from 'axios'
import classNames from 'classnames'
import { useEffect, useRef, useState } from 'react'
import { PatternFormat } from 'react-number-format'
import PhoneInput from 'react-phone-input-2'
import styles from './AuthModal.module.scss'

export interface IAuthModalProps {
	isAuthModalOpen: boolean
	setIsAuthModalOpen: Function
}

export const AuthModal: React.FC<IAuthModalProps> = ({
	isAuthModalOpen,
	setIsAuthModalOpen,
}: IAuthModalProps) => {
	const modalBgRef = useRef<HTMLDivElement>(null)
	const submitBtnRef = useRef<HTMLInputElement>(null)
	const otpBtnRef = useRef<HTMLInputElement>(null)

	const [value, setValue] = useState<string>('+998')
	const [modalState, setModalState] = useState<number>(1)
	const [timer, setTimer] = useState<number>(5)

	const modalCloseHandler = (): void => {
		setIsAuthModalOpen(false)
		setTimer(0)
		setModalState(1)
	}

	const blockZoomInHandler = (e: any): void => {
		if (e.ctrlKey) e.preventDefault()
	}

	const isTelValid = (tel: string): boolean => {
		if (tel.length === 12 && tel.startsWith('998')) {
			return true
		}
		return false
	}

	const pressArrowLeftHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement
		if (input && input.previousElementSibling) {
			const nextInput = input.previousElementSibling as HTMLInputElement
			input.blur()
			nextInput.focus()
		}
	}

	const pressArrowRightHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = e.target as HTMLInputElement
		if (input && input.nextElementSibling) {
			const nextInput = input.nextElementSibling as HTMLInputElement
			input.blur()
			nextInput.focus()
		}
	}

	const OTPCodeInputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Tab') {
			e.preventDefault()
		}

		if (e.key === 'ArrowLeft') {
			pressArrowLeftHandler(e)
		} else if (e.key === 'ArrowRight' || e.key === 'Tab') {
			pressArrowRightHandler(e)
		} else if (e.key === 'Backspace') {
			const input = e.target as HTMLInputElement
			if (input.value) {
				input.value = ''
			} else {
				pressArrowLeftHandler(e)
			}
		} else if (/\d/.test(e.key) && e.key !== 'e') {
			const input = e.target as HTMLInputElement
			const nextInput = input.nextElementSibling as HTMLInputElement

			if (input.value.length === 1) {
				input.value = e.key
			}

			if (nextInput) {
				setTimeout(() => {
					nextInput.focus()
				}, 0)
			}
		} else {
			e.preventDefault()
		}
	}

	useEffect(() => {
		const rootElem = document.querySelector('#root')
		if (isAuthModalOpen) {
			if (rootElem) rootElem.addEventListener('wheel', blockZoomInHandler)
			document.body.style.overflow = 'hidden'
		} else {
			if (rootElem) rootElem.removeEventListener('wheel', blockZoomInHandler)
			document.body.style.overflow = ''
		}

		if (submitBtnRef.current) {
			if (isTelValid(value)) {
				submitBtnRef.current.disabled = false
			} else {
				submitBtnRef.current.disabled = true
			}
		}
	})

	const clickOTPButtonHandler = () => {
		if (otpBtnRef.current) {
			otpBtnRef.current.disabled = true
			if (timer > 0) {
				setTimeout(() => {
					setTimer(timer - 1)
				}, 1000)
			} else {
				otpBtnRef.current.disabled = false
			}
		}
	}

	useEffect(() => {
		clickOTPButtonHandler()
		const OTPInputs = document.querySelectorAll(
			'[data-name="OTPInput"]'
		) as NodeListOf<HTMLInputElement>

		const values: string[] = []
		OTPInputs.forEach((OTPInput: HTMLInputElement) => {
			if (OTPInput.value) {
				values.push(OTPInput.value)
			}
		})

		if (values.length === 4) {
			axios.post('http://localhost:8003/auth/otpcheck', { code: values.join('') })
		}
	})

	useEffect(() => {
		const firstOTPInput = document.querySelector(
			'[data-name="OTPInput"]'
		) as HTMLInputElement
		if (firstOTPInput) {
			firstOTPInput.focus()
		}
	}, [modalState])

	useEffect(() => {
		const telInput = document.querySelector(
			'.react-tel-input input'
		) as HTMLInputElement

		if (modalState === 2) telInput.tabIndex = 1
		else telInput.tabIndex = -1
	}, [isAuthModalOpen])

	useEffect(() => {
		const telInput = document.querySelector(
			'.react-tel-input input'
		) as HTMLInputElement
		if (
			telInput &&
			telInput.parentElement &&
			telInput === document.activeElement
		) {
			telInput.parentElement.style.borderColor = '#ff6900'
		}
	})

	return (
		<>
			<div
				className={classNames(styles.modal, styles.modalSmall, {
					[styles.modalActive]: isAuthModalOpen,
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
				<h2 className={styles.modalTitle}>Вход на сайт</h2>
				{modalState === 1 ? (
					<>
						<p className={styles.modalDescription}>
							Подарим подарок на день рождения, сохраним адрес доставки и расскажем об
							акциях
						</p>
						<form action='#' className={styles.modalForm}>
							<div className={styles.modalFormContainer}>
								<div className={styles.inputLabels}>
									<label>
										<span className={styles.labelText}>Номер телефона</span>
									</label>
								</div>
								<div className={styles.telInputContainer}>
									<label>
										<PhoneInput
											placeholder='+998-99-999-99-99'
											value={value}
											onChange={setValue}
											country='uz'
											masks={{ uz: '..-...-..-..' }}
										/>
									</label>
								</div>
							</div>
							<input
								type='button'
								value='Выслать код'
								className={styles.submitButton}
								ref={submitBtnRef}
								tabIndex={-1}
								onClick={(e): void => {
									e.preventDefault()
									axios.post('http://localhost:8003/auth', { tel: value })
									setModalState(2)
									setTimer(10)
									clickOTPButtonHandler()
								}}
							/>
						</form>
					</>
				) : (
					<>
						<p
							className={classNames(styles.modalDescription, styles.shortDescription)}
						>
							Код отправили сообщением на
						</p>
						<div className={styles.formattedTel}>
							<PatternFormat value={value} format='+### ## ### ## ##' tabIndex={-1} />
							<span
								className={styles.ghostButton}
								onClick={() => {
									setModalState(1)
									setTimer(0)
								}}
							>
								Изменить
							</span>
						</div>
						<div className={styles.otpCodeInputs}>
							{[1, 2, 3, 4].map(id => {
								return (
									<input
										type='tel'
										pattern='[0-9]*'
										className={styles.OTPInput}
										maxLength={1}
										onKeyDown={e => {
											OTPCodeInputHandler(e)
										}}
										onChange={(e): void => {
											if (/\D/.test(e.target.value)) {
												e.target.value = ''
											}
										}}
										tabIndex={1}
										key={id}
										data-name='OTPInput'
									/>
								)
							})}
						</div>
						<input
							type='button'
							value={
								timer !== 0
									? `Получить новый код через ${timer} сек.`
									: 'Получить новый код'
							}
							className={styles.submitButton}
							ref={otpBtnRef}
							onClick={(e): void => {
								e.preventDefault()
								axios.post('http://localhost:8003/auth', { tel: value })

								setTimer(10)
								clickOTPButtonHandler()
							}}
							tabIndex={-1}
						/>
					</>
				)}
			</div>
			<div
				className={styles.modalBg}
				ref={modalBgRef}
				onClick={modalCloseHandler}
			/>
		</>
	)
}
