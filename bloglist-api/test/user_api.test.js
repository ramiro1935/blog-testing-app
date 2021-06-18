const supertest = require('supertest');
const app = require('../app');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const helper = require('./test_helper');

const api = supertest(app);

describe.only('when user is created', () => {
	beforeEach(async () => {
		await User.deleteMany({});

		const saltRounds = 10;
		const passwordHash = await bcrypt.hash('testing', saltRounds);
		const newUser = new User({
			name: 'ramiro',
			username: 'bestoroot',
			password: passwordHash,
		});
		await newUser.save();
	});

	test('creation fails with a password less than 3 characters', async () => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			username: 'ra',
			name: 'ramiro arivicla',
			password: 'te',
		};
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(response.body.error).toContain(
			'username and password should have at least three characters'
		);

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
	test('creation fails with a username and password missing', async () => {
		const usersAtStart = await helper.usersInDb();
		const newUser = {
			name: 'ramiro arivicla',
		};
		const response = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/);

		expect(response.body.error).toContain('missing username or password');

		const usersAtEnd = await helper.usersInDb();
		expect(usersAtEnd).toHaveLength(usersAtStart.length);
	});
});
