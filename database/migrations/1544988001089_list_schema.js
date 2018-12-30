'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ListSchema extends Schema {
  up () {
    this.create('lists', (table) => {
      table.increments()
      table.string('title')
      table.string('genre')
      table.integer('episode')
      table.datetime('airing_from')
      table.datetime('airing_until')
      table.string('type')
      table.string('status')
      table.string('download_status')
      table.string('resolution')
      table.string('storage_device')
      table.mediumtext('note')
      table.timestamps()
    })
  }

  down () {
    this.drop('lists')
  }
}

module.exports = ListSchema
