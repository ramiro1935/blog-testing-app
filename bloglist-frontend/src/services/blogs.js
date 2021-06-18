import axios from 'axios'
const baseUrl = '/api/blogs'

let token

const setToken = tokenKey => {
	token = `Bearer ${tokenKey}`
}

const getAll = async () => {
	const request = await axios.get(baseUrl)
	return request.data
}

const create = async newBlog => {
	const config = {
		headers: { Authorization: token },
	}

	const request = await axios.post(baseUrl, newBlog, config)
	return request.data
}

const update = async updateBlog => {
	const config = {
		headers: { Authorization: token },
	}
	const url = `${baseUrl}/${updateBlog.id}`
	const request = await axios.put(url, updateBlog, config)
	return request.data
}

const remove = async deleteBlogId => {
	const config = {
		headers: { Authorization: token },
	}
	const url = `${baseUrl}/${deleteBlogId}`
	const request = await axios.delete(url, config)
	return request.data
}
export default { getAll, setToken, create, update, remove }
