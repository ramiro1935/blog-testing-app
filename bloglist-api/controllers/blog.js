const blogRoute = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRoute.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
	return response.json(blogs);
});

blogRoute.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id);
	if (blog) return response.json(blog);
	return response.status(400).json({ error: 'id doesnt exist in db' });
});

blogRoute.post('/', async (request, response) => {
	const body = request.body;

	if (!body.title || !body.url)
		return response.status(400).json({ error: 'missing body' });

	const userToken = request.user;
	const user = await User.findById(userToken.id);

	const newBlog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes || 0,
		user: user._id,
	});

	const savedBlog = await newBlog.save();

	user.blogs = user.blogs.concat(savedBlog._id);
	await user.save();

	response.json(savedBlog);
});

blogRoute.put('/:id', async (request, response) => {
	const body = request.body;

	const updatedBlog = {
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		_id: request.params.id,
	};

	await Blog.findByIdAndUpdate(request.params.id, updatedBlog, { new: true });

	response.status(204).end();
});

blogRoute.delete('/:id', async (request, response) => {
	const blogToDelete = await Blog.findById(request.params.id);

	const user = await User.findOne({ username: request.user.username });
	if (blogToDelete.user.toString() !== user._id.toString())
		return response
			.status(401)
			.json({ error: 'only user that created blog can delete it' });

	await Blog.findByIdAndRemove(request.params.id);
	response.status(204).end();
});

module.exports = blogRoute;
