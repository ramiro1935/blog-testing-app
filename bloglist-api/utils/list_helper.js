const lodash = require('lodash');

const dummy = () => {
	return 1;
};

const totalLikes = blogs => {
	return blogs.reduce((sum, act) => (sum += act.likes), 0);
};

const favoriteBlog = blogs => {
	const favorite = blogs.sort((a, b) => b.likes - a.likes)[0];

	return favorite
		? {
				title: favorite.title,
				author: favorite.author,
				likes: favorite.likes,
		  }
		: {};
};

const mostBlogs = blogs => {
	const mostBlog = lodash.countBy(blogs, blog => blog.author);
	const data = Object.keys(mostBlog);
	return data.length !== 0
		? {
				author: data[0],
				blogs: mostBlog[data[0]],
		  }
		: {};
};

const mostLikes = blogs => {
	const blogsLikes = blogs
		.reduce((acc, act) => {
			const exist = acc.find(blog => blog.author === act.author);
			if (exist) {
				exist.likesAcc += act.likes;
			} else {
				acc.push({
					likesAcc: act.likes,
					author: act.author,
				});
			}
			return acc;
		}, [])
		.sort((a, b) => b.likesAcc - a.likesAcc);

	return blogsLikes.length !== 0
		? {
				author: blogsLikes[0].author,
				likes: blogsLikes[0].likesAcc,
		  }
		: {};
};
module.exports = {
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes,
};
