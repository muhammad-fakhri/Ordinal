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
            // title : selected_record.title,
            // genre : selected_record.genre,
            // episode : selected_record.episode,
            // airing_from : selected_record.airing_from,
            // airing_until : selected_record.airing_until,
            // type : selected_record.type,
            // status : selected_record.status,
            // download_status : selected_record.download_status,
            // resolution : selected_record.resolution,
            // storage_device : selected_record.storage_device,
            // note : selected_record.note
        })
    }

    async add({ view }) {
        return view.render('list.add')
    }

    async store({ request, response, session }) {
        // Not using validator from adonis because validation is done using bootstrap 
        //Validate input
        /*const validation = await validate(request.all(), {
            title: 'required',
            genre: 'required'
        })*/ 

        /*if(validation.fails()){
            session.withErrors(validation.messages()).flashAll()
            return response.redirect('back')
        }*/

        const list = new List()

        list.title = request.input('title')
        list.genre = request.input('genre')
        list.episode = request.input('episode')
        list.airing_from = request.input('airing_from')
        list.airing_until = request.input('airing_until')
        list.type = request.input('type')
        list.status = request.input('status')
        list.download_status = request.input('download_status')
        list.resolution = request.input('resolution')
        list.storage_device = request.input('storage_device')
        list.note = request.input('note')

        await list.save()

        session.flash({ notification: 'Anime Added!' })

        return response.redirect('/list/' + list.id)
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
        selected_record.episode = request.input('episode')
        selected_record.airing_from = request.input('airing_from')
        selected_record.airing_until = request.input('airing_until')
        selected_record.type = request.input('type')
        selected_record.status = request.input('status')
        selected_record.download_status = request.input('download_status')
        selected_record.resolution = request.input('resolution')
        selected_record.storage_device = request.input('storage_device')
        selected_record.note = request.input('note')

        await selected_record.save()

        session.flash({ notification: 'Anime Updated!' })

        return response.redirect('/list/' + params.id )
    }

    async delete({ params, session, response }) {
        const list = await List.find(params.id)

        await list.delete()

        session.flash({ 
            fail: true,
            notification: 'Anime Deleted!' 
        })

        return response.redirect('/list')
    }
}

module.exports = ListController
