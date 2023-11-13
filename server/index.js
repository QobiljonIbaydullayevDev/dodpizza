const express = require('express')
const cors = require('cors')
const otpGenerator = require('otp-generator')

const server = express()
const PORT = 8003

server.use(cors())
server.use(express.json())

server.post('/auth', (req, res) => {
	const otp = otpGenerator.generate(4, {
		upperCaseAlphabets: false,
		lowerCaseAlphabets: false,
		specialChars: false,
	})
	console.log(req.body.tel, otp)
})

server.post('/auth/otpcheck', (req, res) => {
	console.log(req.body.code)
})

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
