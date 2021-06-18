const Blog = require('../models/blog');
const User = require('../models/user');

const initialBlogs = [
	{
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
		likes: 5,
	},
];

const nonExistingId = async () => {
	const newBlog = new Blog(initialBlogs[0]);
	await newBlog.save();
	await newBlog.delete();
	return newBlog._id.toString();
};

const blogsInDb = async () => {
	const blogs = await Blog.find({}).populate('user');
	//Necesario para cnvertir el _id a id y eliminar el _V
	return blogs.map(blog => blog.toJSON());
};

const usersInDb = async () => {
	const users = await User.find({});
	return users.map(user => user.toJSON());
};

module.exports = {
	nonExistingId,
	blogsInDb,
	usersInDb,
	initialBlogs,
};
