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

Route.on('/').render('index')

Route.get('/home', 'HomeController.index')

Route.get('/list', 'ListController.index')

Route.get('/list/add', 'ListController.add')

Route.get('/list/edit/:id', 'ListController.edit')

Route.get('/list/:id', 'ListController.detail')

Route.post('/list', 'ListController.store')

Route.put('/list/:id', 'ListController.update')

Route.delete('/list/:id', 'ListController.delete')