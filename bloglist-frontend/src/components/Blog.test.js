import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Blog from './Blog'

const blog = {
	title: 'title react',
	author: 'author test',
	url: 'http://url.com',
	likes: 23,
}

describe('<Blog />', () => {
	let component
	const updateBlog = jest.fn()
	const deleteBlog = jest.fn()

	beforeEach(() => {
		component = render(
			<Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} />
		)
	})

	test('renders blog correctly', () => {
		const div = component.container.querySelector('.blog')
		expect(div).toHaveTextContent('title react')
	})

	test('renders blog detail correctly', () => {
		const button = component.getByText('view')
		fireEvent.click(button)

		const div = component.container.querySelector('.blogdetail')
		expect(div).toHaveTextContent('http://url.com')
	})

	test('hide blog detail correctly', () => {
		const button = component.getByText('view')
		fireEvent.click(button)

		const div = component.container.querySelector('.blogdetail')
		expect(div).toHaveTextContent('http://url.com')

		const hide = component.getByText('hide')
		fireEvent.click(hide)

		/* expect(div).not.tohave */
	})

	test('update blog detail correctly', () => {
		const button = component.getByText('view')
		fireEvent.click(button)

		const div = component.container.querySelector('.blogdetail')
		expect(div).toHaveTextContent('http://url.com')

		const update = component.getByText('like')
		fireEvent.click(update)

		expect(updateBlog.mock.calls).toHaveLength(1)
	})
	test('delete blog detail correctly', () => {
		const button = component.getByText('view')
		fireEvent.click(button)

		const div = component.container.querySelector('.blogdetail')
		expect(div).toHaveTextContent('http://url.com')

		const remove = component.getByText('remove')
		fireEvent.click(remove)
		expect(deleteBlog.mock.calls).toHaveLength(1)
	})
})
