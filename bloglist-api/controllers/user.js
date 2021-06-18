const bcrypt = require('bcrypt');
const userRouter = require('express').Router();
const User = require('../models/user');

userRouter.get('/', async (request, response) => {
	const users = await User.find({}).populate('blogs', {
		url: 1,
		title: 1,
		author: 1,
	});
	response.json(users);
});

userRouter.post('/', async (request, response) => {
	const body = request.body;

	if (!body.username || !body.password)
		return response.status(400).json({ error: 'missing username or password' });

	if (body.password.length < 3 || body.username < 3)
		return response.status(400).json({
			error: 'username and password should have at least three characters',
		});

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash(body.password, saltRounds);
	const newUser = User({
		username: body.username,
		name: body.name,
		passwordHash,
	});

	const userSaved = await newUser.save();

	response.json(userSaved);
});

module.exports = userRouter;
