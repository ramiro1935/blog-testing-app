const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const middleware = require('./utils/ middleware')

logger.info('connection to', config.MONGODB_URI)

mongoose
	.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	})
	.then(() => {
		logger.info('connected to mongodb')
		console.log('conectado a la db')
	})
	.catch(error => {
		logger.error('error connecting to mongodb', error.message)
	})

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, blogRouter)
app.use('/api/users', userRouter)

console.log('log', process.env.NODE_ENV)
if (process.env.NODE_ENV === 'test') {
	const testingRouter = require('./controllers/testing')
	app.use('/api/testing', testingRouter)
}

app.use(middleware.unknowEndPoint)
app.use(middleware.errorHandler)

module.exports = app
