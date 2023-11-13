import { NavigationBar, Container, Footer, AuthModal, Banner } from 'components'
import { AboutPage } from 'pages/AboutPage'
import { HomePage } from 'pages/HomePage'
import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'

const App: React.FC = () => {
	const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

	useEffect(() => {
		
	})
	return (
		<>
			<Container>
				<Banner setIsAuthModalOpen={setIsAuthModalOpen} />
				<NavigationBar />
				<AuthModal
					isAuthModalOpen={isAuthModalOpen}
					setIsAuthModalOpen={setIsAuthModalOpen}
				/>
				<Routes>
					<Route path='/' element={<HomePage />} />
					<Route path='/about' element={<AboutPage />} />
				</Routes>
			</Container>
			<Footer />
		</>
	)
}

export default App
