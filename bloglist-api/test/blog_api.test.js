const config = require('../utils/config');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');
const bcrypt = require('bcrypt');

let token;
const loginUser = async () => {
	const user = {
		username: 'bestoroot',
		name: 'ramiro',
		password: 'testing',
	};

	const response = await api
		.post('/api/login/')
		.send(user)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	return response.body.token || '';
};

beforeAll(async () => {
	await mongoose.connect(config.MONGODB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
		useCreateIndex: true,
	});
});

afterAll(() => {
	mongoose.connection.close();
});

beforeEach(async () => {
	await Blog.deleteMany({});
	await User.deleteMany({});

	const saltRounds = 10;
	const passwordHash = await bcrypt.hash('testing', saltRounds);
	const newUser = new User({
		name: 'ramiro',
		username: 'bestoroot',
		passwordHash,
	});

	const user = await newUser.save();

	const blogObjects = helper.initialBlogs.map(blog => {
		const newBlog = new Blog(blog);
		newBlog.user = user._id;
		return newBlog;
	});
	const promiseArray = blogObjects.map(blog => blog.save());
	await Promise.all(promiseArray);
});

describe('when there is initialy some blogs saved', () => {
	test('all blogs are returned', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body).toHaveLength(helper.initialBlogs.length);
	});

	test('a specific blog is within the returned blogs', async () => {
		const response = await api.get('/api/blogs');
		const contents = response.body.map(blog => blog.title);
		expect(contents).toContain('React patterns');
	});

	test('all blogs have id as property', async () => {
		const response = await api.get('/api/blogs');
		expect(response.body[0].id).toBeDefined();
		expect(response.body[0]._id).toBeUndefined();
	});
});

describe('viewving a specific blog', () => {
	test('succeeds with a valid id', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToView = blogsAtStart[0];
		const response = await api
			.get(`/api/blogs/${blogToView.id}`)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		expect(response.body.title).toContain(blogToView.title);
	});

	test('fails withh statuscode 400 if note doesnt exist', async () => {
		const validNonexistingId = helper.nonExistingId();
		await api.get(`/api/blogs/${validNonexistingId}`).expect(400);
	});

	test('fails with statuscode 400 id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445';
		await api.get(`/api/blogs/${invalidId}`).expect(400);
	});
});

describe('addition of a new blog', () => {
	test('a valid blog can be added', async () => {
		token = await loginUser();

		const user = await helper.usersInDb();
		const newBlog = {
			title: 'Padre rico padre pobre',
			author: 'Kiyosaki',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			likes: 10,
			user: user[0].id,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		const contents = blogsAtEnd.map(blog => blog.title);

		expect(contents).toHaveLength(helper.initialBlogs.length + 1);
		expect(contents).toContain('Padre rico padre pobre');
	});

	test('a valid blog without like property it will defined with 0', async () => {
		token = await loginUser();
		const user = await helper.usersInDb();

		const newBlog = {
			title: 'Padre rico padre pobre',
			author: 'Kiyosaki',
			url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
			user: user[0].id,
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(200)
			.expect('Content-Type', /application\/json/);

		const blogsAtEnd = await helper.blogsInDb();
		const contents = blogsAtEnd.map(blog => blog.title);

		expect(contents).toHaveLength(helper.initialBlogs.length + 1);
		expect(contents).toContain('Padre rico padre pobre');
	});

	test('an invalid object content cant be added', async () => {
		token = await loginUser();
		const newBlog = {
			author: 'Kiyosaki',
		};

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${token}`)
			.send(newBlog)
			.expect(400)
			.expect('Content-Type', /application\/json/);
	});
	test('unauthorized create', async () => {
		token = await loginUser();
		const newBlog = {
			author: 'Kiyosaki',
			title: 'testing',
			url: 'http://testing',
		};

		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(401)
			.expect('Content-Type', /application\/json/);
	});
});

describe('deletion of a blog', () => {
	test('succeeds with status code 204', async () => {
		token = await loginUser();
		const blogsAtStart = await helper.blogsInDb();
		const blogToDelete = blogsAtStart[0];
		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `Bearer ${token}`)
			.expect(204);
	});
});

describe('update of a blog', () => {
	test('succeeds with status code 204', async () => {
		const blogsAtStart = await helper.blogsInDb();
		const blogToUpdate = blogsAtStart[0];
		const newBlog = {
			...blogToUpdate,
			likes: 39,
		};

		await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(204);
	});
});
