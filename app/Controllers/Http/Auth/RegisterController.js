'use strict'
//bring in the validator
const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = require('random-string')
const Mail = use('Mail')

class RegisterController {
	async showRegisterForm({ view }) {
		return view.render('auth.register')
	}

	async register({ request, session, response }) {
		//Validation Process
		//get the form data
		const data = request.all()

		//validation rules
		const rules = {
			username: 'required|unique:users,username',
    		email: 'required|email|unique:users,email', 
    		password: 'required'
		}

		//error messages
		const messages = {
            'username.required': 'Please enter your desired username',
            'username.unique': 'Please choice other username',
            'email.required': 'Please enter your email address',
            'email.email': 'Please enter your email address correctly',
            'email.unique': 'This email has already been used',
            'password.required': 'Please enter your desired password',
        }

		//validate the data
		const validation = await validateAll(data, rules, messages)

		//if validation is fails
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')
		}

		//create the user
		const user = await User.create({
			username: request.input('username'),
			email: request.input('email'),
			password: request.input('password'),
			confirmation_token: randomString({ length: 40 })
		})

		//send confirmation email
		await Mail.send('auth.email.confirm_email', user.toJSON(), message => {
			message
			.to(user.email)
			.from('noreply@ordinal.com')
			.subject('Please confirm your email')
		})

		//display success message
		/session.flash({
			notification: 'Your registration is success! Please check your email inbox and confirm your email address.'
		})

		return response.redirect('back')
	}

	async confirmEmail({ params, session, response }) {
		//get the user data from confirmation token
		const user = await User.findBy('confirmation_token', params.token)

		//set confirmation token to null and is_active field to true
		user.confirmation_token = null
		user.is_active = true

		//save user to database again
		await user.save()

		//display success message
		session.flash({
			notification: 'Your email address has been confirmed.'
		})

		return response.redirect('/login')
	}
}

module.exports = RegisterController
