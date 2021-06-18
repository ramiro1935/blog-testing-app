import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Toggable from './components/Toggable'
import blogService from './services/blogs'
import loginService from './services/login'

const NotifyComponent = ({ notify }) => {
	if (notify) {
		const { message, type } = notify
		return (
			<div className={type}>
				<p>{message}</p>
			</div>
		)
	}
	return <></>
}

const BlogList = ({ blogs, updateBlog, deleteBlog }) => {
	const sorted = [...blogs].sort((a, b) => b.likes - a.likes)
	return (
		<div id='blogList'>
			{sorted.map(blog => (
				<Blog
					key={blog.id}
					blog={blog}
					updateBlog={updateBlog}
					deleteBlog={deleteBlog}
				/>
			))}
		</div>
	)
}

const App = () => {
	const [blogs, setBlogs] = useState([])
	const [user, setUser] = useState(null)
	const [notify, setNotify] = useState(null)
	const blogRef = useRef()

	useEffect(() => {
		blogService.getAll().then(blogs => setBlogs(blogs))
	}, [])

	useEffect(() => {
		const loggedUserJson = window.localStorage.getItem('user')
		if (loggedUserJson) {
			const user = JSON.parse(loggedUserJson)
			setUser(user)
			blogService.setToken(user.token)
		}
	}, [])

	const handleLogin = async newUser => {
		try {
			const response = await loginService.login(newUser)
			setUser(response)
			blogService.setToken(response.token)
			window.localStorage.setItem('user', JSON.stringify(response))
		} catch (error) {
			withNotify(error.response.data.error, 'error')
		}
	}

	const handleLogout = e => {
		e.preventDefault()
		setUser(null)
		window.localStorage.removeItem('user')
	}

	const createNewBlog = async newBlog => {
		try {
			const createdBlog = await blogService.create(newBlog)
			setBlogs(blogs => blogs.concat(createdBlog))
			withNotify('a new blog was added')
			blogRef.current.toggleVisibilty()
		} catch (error) {
			withNotify(error.response.error, 'error')
		}
	}
	const updateBlog = async blog => {
		try {
			const updateBlogContent = {
				...blog,
				likes: blog.likes + 1,
			}
			await blogService.update(updateBlogContent)
			const newBlogs = [...blogs]
			const indexBlog = newBlogs.findIndex(b => b.id === blog.id)
			newBlogs[indexBlog].likes = newBlogs[indexBlog].likes + 1
			setBlogs(newBlogs)
		} catch (error) {
			withNotify(error.response.data.error, 'error')
		}
	}

	const deleteBlog = async blog => {
		try {
			const confirm = await window.confirm(
				`Remove blog ${blog.title} by ${blog.author}`
			)
			if (confirm) {
				await blogService.remove(blog.id)
				const newBlogs = [...blogs]
				setBlogs(newBlogs.filter(b => b.id !== blog.id))
			}
		} catch (error) {
			withNotify(error.response.data.error, 'error')
		}
	}

	const withNotify = (message, type = 'success') => {
		setNotify({ message, type })
		setTimeout(() => {
			setNotify(null)
		}, 3000)
	}

	return (
		<div>
			<h2>blogs</h2>

			<NotifyComponent notify={notify} />
			{!user ? (
				<Toggable buttonLabel={'login'}>
					<LoginForm handleLogin={handleLogin} />{' '}
				</Toggable>
			) : (
				<Toggable buttonLabel={'create new note'} ref={blogRef}>
					<BlogForm createNewBlog={createNewBlog} handleLogout={handleLogout} />
				</Toggable>
			)}
			<BlogList blogs={blogs} updateBlog={updateBlog} deleteBlog={deleteBlog} />
		</div>
	)
}

export default App
