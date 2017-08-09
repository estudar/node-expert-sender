'use strict'

const Request = require('../request')
const xml = require('../../xml')

/**
 * Add multiple Rows to Data Table
 *
 * Read the docs for more info about the options.
 * https://sites.google.com/a/expertsender.com/api-documentation/methods/datatables/add-multiple-rows
 */
class DataTablesAddMultipleRowsRequest extends Request {
  get method() { return 'POST' }
  get path()   { return '/Api/DataTablesAddMultipleRows/' }

  constructor(apiKey, tableName, rows, options = {}) {
    super(apiKey, options)

    this.tableName = tableName
    this.rows = rows
  }

  xmlData() {
    const rows = [].concat(this.row)

    const rowXML = (row) => [
    ]

    let rowsXML
    if (rows.length > 1) {
      rowsXML = rows.map(row => xml.tag('Row', rowXML(row)))
    } else {
      rowsXML = rowXML(rows[0])
    }

    return [
      xml.tag('TableName', this.tableName),
      xml.tag('Data', this.rows.map(row => {
        return xml.tag('Row',
          xml.tag('Columns', Object.keys(row).map((columnName) => {
            return xml.tag('Column', [
              xml.tag('Name', columnName),
              xml.tag('Value', row[columnName])
            ])
          })),
          { escapeValue: false }
        )
      }))
    ]
  }
}

module.exports = DataTablesAddMultipleRowsRequest
