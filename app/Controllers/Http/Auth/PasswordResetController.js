'use strict'
const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/PasswordReset')
const randomString = require('random-string')
const Mail = use('Mail')

class PasswordResetController {
	async showRequestForm({ view }) {
		return view.render('auth.request')
	}

	async sendResetLinkEmail({ request, session, response }) {
		//Validation Process
		//error messages
		const messages = {
			'email.required': 'Please enter your email address',
            'email.email': 'Please enter your email address correctly' 
		}

		//validate the input
		const validation = await validate(request.only('email'), {
			email: 'required|email'
		}, messages)

		//if validation is fails
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')
		}

		//if validation is pass
		try {
			//get the user data
			const user = await User.findBy('email', request.input('email'))
			
			await PasswordReset.query()
			.where('email', user.email)
			.delete()

			//create password reset token
			const { token } = await PasswordReset.create({
				email: user.email,
				token: randomString({ length: 40 })
			})

			//create the email data
			const mailData = {
				user: user.toJSON(),
				token
			}

			//send mail
			await Mail.send('auth.email.password_reset', mailData, message => {
				message
				.to(user.email)
				.from('noreply@ordinal.com')
				.subject('Password Reset Link')
			})

			//display success message
			session.flash({
				notification: 'A password reset link has been sent to your email.'
			})

			//back to request form
			return response.redirect('back')
		} catch(error) {
			session.flash({
				fail: true,
				notification: 'Sorry, there is no account with this email address.'
			})

			//back to request form
			return response.redirect('back')
		}
	}

	async showResetForm({ params, view }) {
		return view.render('auth.reset', {
			token: params.token
		})
	}

	async reset({ session, request, response }) {
		//Validation process
		//get the form data
		const data = request.all()
		
		//validation rules
		const rules = {
			token: 'required',
			email: 'required|email',
			password: 'required|confirmed'
		}
		
		//error messages
		const messages = {
			'email.required': 'Please enter your email address',
			'email.email': 'Please enter your email address correctly',
			'password.required': 'Please enter your password',
			'password.confirmed': 'Please confirm your password'
		}

		//validate form input
		const validation = await validateAll(data, rules, messages)

		//if validation fail
		if (validation.fails()) {
			session.withErrors(validation.messages()).flashAll()
			return response.redirect('back')
		}

		//if validation pass
		try {
			//get user data by email
			const user = await User.findBy('email', request.input('email'))

			//check password reset token is exist or not
			const token = await PasswordReset.query()
				.where('email', user.email)
				.where('token', request.input('token'))
				.first()

			//if password reset token is not exist
			if(!token) {
				session.flash({
					fail: true,
					notification: 'This password reset request is expired'
				})

				return response.redirect('back')
			}

			//if password reset token is exist
			user.password = request.input('password')
			await user.save()
			
			//delete password reset token
			await PasswordReset.query()
				.where('email', user.email)
				.delete()

			//display success message
			session.flash({
				notification: 'Your password has been reset!'
			})
			
			return response.redirect('/login')
		} catch (error) {
			//display error message
			session.flash({
				fail: true,
				notification: 'Sorry, there is no account with this email address.'
			})

			return response.redirect('back')
		}
	}
}

module.exports = PasswordResetController
