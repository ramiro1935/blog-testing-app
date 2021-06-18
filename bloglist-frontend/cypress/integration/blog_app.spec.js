describe('Blog app', function () {
	beforeEach(function () {
		cy.request('POST', 'http://localhost:3003/api/testing/reset')
		cy.createUser({
			name: 'Ramiro',
			username: 'bestoroot',
			password: 'testing',
		})
		cy.visit('http://localhost:3000')
	})
	it('front page can be opened', function () {
		cy.contains('blogs')
	})

	describe('login', function () {
		it('login form can be openened', function () {
			cy.contains('login').click()
			cy.get('#user').type('bestoroot')
			cy.get('#password').type('testing')
			cy.get('#loginButton').click()

			cy.contains('create new')
		})

		it('login fails with wrong password', function () {
			cy.contains('login').click()
			cy.get('#user').type('bestoroot')
			cy.get('#password').type('12345')
			cy.get('#loginButton').click()
			cy.get('.error').should('contain', 'invalid username or password')
		})
	})

	describe('when logged in', function () {
		beforeEach(function () {
			cy.login({ username: 'bestoroot', password: 'testing' })
		})

		it('a new blog can be created', function () {
			cy.contains('create new note').click()
			cy.get('#title').type('a new blog')
			cy.get('#author').type('created by cypress')
			cy.get('#url').type('https://cypress.com')
			cy.get('#createBlog').click()
			cy.contains('a new blog was added')
		})

		describe('and there are blogs', function () {
			beforeEach(function () {
				cy.createBlog({
					title: 'este es un titulo',
					url: 'http://primer',
					author: 'primer author',
				})
				cy.createBlog({
					title: 'este es un titulo 2',
					url: 'http://segundo',
					author: 'segundo author',
				})
			})

			it('blogs are ordered desc', function () {
				cy.get('.togglebutton:first').click()
				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(1)

				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(2)

				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(3)

				cy.get('#blogList')
					.each(($blog, index, $blogs) => {
						cy.wrap($blog).contains('view').click()
					})
					.then($blogs => {
						cy.get('.likes:first').contains(3)
						cy.get('.likes:last').contains(0)
					})
			})

			it('a blog can be liked', function () {
				cy.get('.togglebutton:first').click()
				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(1)

				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(2)

				cy.get('.likeButton:first').click()
				cy.get('.likes:first').contains(3)
			})
			it('a second blog can be liked', function () {
				cy.get('.togglebutton:last').click()
				cy.get('.likeButton:last').click()
				cy.get('.likes:last').contains(1)

				cy.get('.likeButton:last').click()
				cy.get('.likes:last').contains(2)

				cy.get('.likeButton:last').click()
				cy.get('.likes:last').contains(3)
			})

			describe('remove blogs', function () {
				it('a blog is removed successfully', function () {
					cy.get('.togglebutton:first').click()
					cy.get('.removeButton').click()
				})
				it('blog cant be removed by wrong user', function () {
					cy.createUser({
						name: 'Denis',
						username: 'hunter',
						password: 'testing',
					})
					cy.login({ username: 'hunter', password: 'testing' })
					cy.get('.togglebutton:first').click()
					cy.get('.removeButton').click()
					cy.contains('only user that created blog can delete it')
				})
			})
		})
	})
})
