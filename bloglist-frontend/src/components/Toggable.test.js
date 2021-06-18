import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { fireEvent, render } from '@testing-library/react'
import Toggable from './Toggable'

describe('<Toggable />', () => {
	let component
	beforeEach(() => {
		component = render(<Toggable buttonLabel='...show' />)
	})
	test('show content successfully', () => {
		const button = component.container.querySelector('#show > button')
		fireEvent.click(button)

		const cancel = component.container.querySelector('#hidden')
		expect(cancel).not.toHaveStyle('display:none')
	})
	test('hide content successfully', () => {
		const button = component.container.querySelector('#show > button')
		fireEvent.click(button)

		const hiddenDiv = component.container.querySelector('#hidden')
		expect(hiddenDiv).not.toHaveStyle('display:none')

		const cancel = component.container.querySelector('#hidden > button')
		fireEvent.click(cancel)

		expect(hiddenDiv).toHaveStyle('display:none')
	})
	test('show and hide content successfully', () => {
		const button = component.container.querySelector('#show > button')
		fireEvent.click(button)

		const hiddenDiv = component.container.querySelector('#hidden')
		expect(hiddenDiv).not.toHaveStyle('display:none')

		const cancel = component.container.querySelector('#hidden > button')
		fireEvent.click(cancel)

		expect(hiddenDiv).toHaveStyle('display:none')
		fireEvent.click(button)
		expect(hiddenDiv).not.toHaveStyle('display:none')
	})
})
