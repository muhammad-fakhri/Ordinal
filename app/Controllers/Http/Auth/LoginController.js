'use strict'
const User = use('App/Models/User')
const Hash = use('Hash')
const { validate } = use('Validator')

class LoginController {
	async showLoginForm({ view }) {
		return view.render('auth.login')
	}

	async login({ auth, response, session, request }) {
		//Validation process
		//get the data from the form
		const { email, password } = request.all()

		//validation rules
		const rules = {
			email: 'required|email',
			password: 'required'
		}
		
		//error messages
		const messages = {
			'email.required': 'Please enter your email address',
			'email.email': 'Please enter your email address correctly',
			'password.required': 'Please enter your password'
		}

		//validate the data 
		const validation = await validate(request.all(), rules, messages)
	
		//if validation fails
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')
		}

		//retrieve the user data from the database
		const user = await User.query()
		.where('email', email)
		.where('is_active', true)
		.first()

		//verify user password
		//if user is found
		if (user) {
			const passwordVerified = await Hash.verify(password, user.password)

			//if password is match
			if(passwordVerified) {
				//login the user
				await auth.login(user)

				return response.redirect('home')
			}
		}

		//if user is not found
		session.flash({
			notification: `We cannot verify your account. Make sure you've confirmed your email address or use registered email and password. `,
			fail: true
		})

		return response.redirect('back')
	}
}	

module.exports = LoginController
