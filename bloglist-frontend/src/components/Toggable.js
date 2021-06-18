import React, { useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggable = React.forwardRef((props, ref) => {
	const [visible, setVisible] = useState(false)

	const hidenWhenVisible = { display: visible ? 'none' : '' }
	const showWhenVisible = { display: visible ? '' : 'none' }

	const toggleVisibilty = () => setVisible(!visible)

	useImperativeHandle(ref, () => {
		return {
			toggleVisibilty,
		}
	})

	return (
		<div>
			<div id='show' style={hidenWhenVisible}>
				<button onClick={toggleVisibilty}>{props.buttonLabel}</button>
			</div>
			<div id='hidden' style={showWhenVisible}>
				{props.children}
				<button onClick={toggleVisibilty}>cancel</button>
			</div>
		</div>
	)
})

Toggable.displayName = 'Toggable'

Toggable.propTypes = {
	buttonLabel: PropTypes.string.isRequired,
}
export default Toggable
