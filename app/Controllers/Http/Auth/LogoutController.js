'use strict'

class LogoutController {
	async logout({ auth, response, session }) {
		//logout the user
		await auth.logout()

		//display success messages
		session.flash({
			notification: "You've been logged out."
		})

		//back to login page
		return response.redirect('/login')
	}
}

module.exports = LogoutController
