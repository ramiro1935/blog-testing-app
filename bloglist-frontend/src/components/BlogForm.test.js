import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { fireEvent, render } from '@testing-library/react'
import BlogForm from './BlogForm'

describe('<BlogForm />', () => {
	let component
	const createNewBlog = jest.fn()
	beforeEach(() => {
		component = render(<BlogForm createNewBlog={createNewBlog} />)
	})

	test('blog created successfully', () => {
		const title = component.container.querySelector('#title')
		fireEvent.change(title, {
			target: { value: 'this is the title' },
		})
		const author = component.container.querySelector('#author')
		fireEvent.change(author, {
			target: { value: 'this is the author' },
		})
		const url = component.container.querySelector('#url')
		fireEvent.change(url, {
			target: { value: 'http://test.com' },
		})

		const form = component.container.querySelector('#blogForm')
		fireEvent.submit(form)

		expect(createNewBlog.mock.calls).toHaveLength(1)

		expect(createNewBlog.mock.calls[0][0].title).toBe('this is the title')
		expect(createNewBlog.mock.calls[0][0].author).toBe('this is the author')
		expect(createNewBlog.mock.calls[0][0].url).toBe('http://test.com')
	})
})
