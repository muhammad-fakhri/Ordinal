'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('index').as('home').middleware(['auth'])

Route.get('/home', 'HomeController.index').middleware(['auth'])

Route.get('/list', 'ListController.index').middleware(['auth'])

Route.get('/list/add', 'ListController.add').middleware(['auth'])

Route.get('/list/edit/:id', 'ListController.edit').middleware(['auth'])

Route.get('/list/:id', 'ListController.detail').middleware(['auth'])

Route.get('/login', 'Auth/LoginController.showLoginForm').middleware(['authenticated'])

Route.get('/logout', 'Auth/LogoutController.logout').middleware(['auth'])

Route.get('/password/reset/:token', 'Auth/PasswordResetController.showResetForm').middleware(['authenticated'])

Route.get('/password/reset', 'Auth/PasswordResetController.showRequestForm').middleware(['authenticated'])

Route.get('/register', 'Auth/RegisterController.showRegisterForm').middleware(['authenticated'])

Route.get('/register/confirm/:token', 'Auth/RegisterController.confirmEmail').middleware(['authenticated'])

Route.post('/list', 'ListController.store')

Route.post('/login', 'Auth/LoginController.login').as('login')

Route.post('/password/email', 'Auth/PasswordResetController.sendResetLinkEmail')

Route.post('/password/reset', 'Auth/PasswordResetController.reset')

Route.post('/register', 'Auth/RegisterController.register').as('register')

Route.put('/list/:id', 'ListController.update')

Route.delete('/list/:id', 'ListController.delete')