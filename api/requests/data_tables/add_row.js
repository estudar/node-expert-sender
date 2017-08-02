'use strict'

const Request = require('../request')
const xml = require('../../xml')

/**
 * Add a Row to Data Table
 *
 * Read the docs for more info about the options.
 * https://sites.google.com/a/expertsender.com/api-documentation/methods/datatables/add-row
 */
class DataTablesAddRowRequest extends Request {
  get method() { return 'POST' }
  get path()   { return '/Api/DataTablesAddRow/' }

  constructor(apiKey, tableName, row, options = {}) {
    super(apiKey, options)

    this.tableName = tableName
    this.row = row
  }

  xmlData() {
    return [
      xml.tag('TableName', this.tableName),
      xml.tag('Data', [
        xml.tag('Columns',
          Object.keys(this.row).map((columnName) => {
            return xml.tag('Column', [
              xml.tag('Name', columnName),
              xml.tag('Value', this.row[columnName])
            ])
          })
        )
      ])
    ]
  }
}

module.exports = DataTablesAddRowRequest
