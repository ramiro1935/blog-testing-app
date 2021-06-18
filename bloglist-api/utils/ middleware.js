const logger = require('./logger');
const jwt = require('jsonwebtoken');

const userExtractor = async (request, response, next) => {
	const tokenDecoded = jwt.decode(request.token, process.env.SECRET);
	if (tokenDecoded) {
		request.user = { username: tokenDecoded.username, id: tokenDecoded.id };
	}
	next();
};

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization');
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		request.token = authorization.substring(7);
	}
	console.error('entro qui');
	next();
};

const unknowEndPoint = (request, response) => {
	response.status(404).send({ error: 'unknow endpoint' });
};

const errorHandler = (error, request, response, next) => {
	logger.error(error.message, error);
	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'malformatted id' });
	} else if (error.name === 'ValidationError') {
		return response.status(400).send({ error: error.message });
	} else if (error.name === 'JsonWebTokenError') {
		return response.status(401).json({
			error: 'invalid token',
		});
	}

	next(error);
};

module.exports = {
	unknowEndPoint,
	errorHandler,
	tokenExtractor,
	userExtractor,
};
