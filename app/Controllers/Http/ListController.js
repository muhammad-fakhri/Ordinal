'use strict'
//Import the List Model
const List = use('App/Models/List')

//Import the validator
const { validate } = use('Validator')

class ListController {
    async index({ view }){

        const list = await List.all()

        return view.render('list.index', {
            list: list.toJSON()
        })
    }

    async detail({ params, view }) {
        const selected_record = await List.find(params.id)

        return view.render('list.detail', {
            anime : selected_record
        })
    }

    async add({ view }) {
        return view.render('list.add')
    }

    async store({ request, response, session }) {
        //Validate input
        const validation = await validate(request.all(), {
            title: 'required',
            genre: 'required'
        })

        if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }

        const list = new List()

        list.title = request.input('title')
        list.genre = request.input('genre')

        await list.save()

        session.flash({ notification: 'Anime Added!' })

        return response.redirect('/list')
    }

    async edit({ view, params }) {
        const selected_record = await List.find(params.id)

        return view.render('list.edit', {
            anime: selected_record 
        })
    }

    async update({ params, request, response, session }) {
        const selected_record = await List.find(params.id)

        selected_record.title = request.input('title')
        selected_record.genre = request.input('genre')

        await selected_record.save()

        session.flash({ notification: 'Anime Updated!' })

        return response.redirect('/list')
    }

    async delete({ params, session, response }) {
        const list = await List.find(params.id)

        await list.delete()

        session.flash({ notification: 'Anime Deleted!' })

        return response.redirect('/list')
    }
}

module.exports = ListController
