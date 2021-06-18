import React, { useState } from 'react'
import PropTypes from 'prop-types'

export const BlogDetail = ({ blog, updateBlog, deleteBlog }) => {
	return (
		<div className='blogdetail'>
			<p>{blog.url}</p>
			<p className='likes'>
				{blog.likes}{' '}
				<button className='likeButton' onClick={() => updateBlog(blog)}>
					like
				</button>
			</p>
			<p>{blog.author}</p>
			<button className='removeButton' onClick={() => deleteBlog(blog)}>
				remove
			</button>
		</div>
	)
}

BlogDetail.propTypes = {
	blog: PropTypes.object.isRequired,
	updateBlog: PropTypes.func.isRequired,
	deleteBlog: PropTypes.func.isRequired,
}

const Blog = ({ blog, deleteBlog, updateBlog }) => {
	const blogStyle = {
		paddingTop: 10,
		paddingLeft: 2,
		border: 'solid',
		borderWidth: 1,
		marginBotton: 5,
		marginTop: 5,
	}
	const buttonToggle = {
		margin: 5,
	}
	const [toggleDetail, setToggleDetail] = useState(false)

	const handleToggleDetail = () => {
		setToggleDetail(!toggleDetail)
	}

	return (
		<div className='blog' style={blogStyle}>
			{blog.title} {blog.author}
			<button
				className='togglebutton'
				style={buttonToggle}
				onClick={handleToggleDetail}>
				{toggleDetail ? 'hide' : 'view'}
			</button>
			{toggleDetail && (
				<BlogDetail
					blog={blog}
					deleteBlog={deleteBlog}
					updateBlog={updateBlog}
				/>
			)}
		</div>
	)
}

Blog.propTypes = {
	blog: PropTypes.object.isRequired,
	deleteBlog: PropTypes.func.isRequired,
	updateBlog: PropTypes.func.isRequired,
}

export default Blog
