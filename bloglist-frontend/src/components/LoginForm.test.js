import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import LoginForm from './LoginForm'

describe('<LoginForm />', () => {
	let component
	const handleLogin = jest.fn()
	beforeEach(() => {
		component = render(<LoginForm handleLogin={handleLogin} />)
	})

	test('user is loggin correctly', () => {
		const user = component.container.querySelector('#user')
		fireEvent.change(user, {
			target: { value: 'bestoroot' },
		})
		const password = component.container.querySelector('#password')
		fireEvent.change(password, {
			target: { value: 'testing' },
		})
		const form = component.container.querySelector('form')
		fireEvent.submit(form)

		expect(handleLogin.mock.calls).toHaveLength(1)
		expect(handleLogin.mock.calls[0][0].username).toBe('bestoroot')
	})
})
