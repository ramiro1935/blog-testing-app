import React, { useState } from 'react'
import Proptypes from 'prop-types'

const LoginFom = ({ handleLogin }) => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')

	const handleUser = e => {
		setUsername(e.target.value)
	}

	const handlePassword = e => {
		setPassword(e.target.value)
	}

	const login = e => {
		e.preventDefault()
		handleLogin({ username, password })
		setUsername('')
		setPassword('')
	}
	return (
		<div>
			<h1>log in to application</h1>

			<form onSubmit={login}>
				<div>
					Email:{' '}
					<input id='user' type='text' value={username} onChange={handleUser} />
				</div>
				<div>
					Password:{' '}
					<input
						id='password'
						type='password'
						value={password}
						onChange={handlePassword}
					/>
				</div>
				<input id='loginButton' type='submit' value={'login'} />
			</form>
		</div>
	)
}

LoginFom.propTypes = {
	handleLogin: Proptypes.func.isRequired,
}
export default LoginFom
