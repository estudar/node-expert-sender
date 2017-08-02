'use strict'

const Request = require('../request')
const xml = require('../../xml')

/**
 * Update a Data Table Row
 *
 * Read the docs for more info about the options.
 * https://sites.google.com/a/expertsender.com/api-documentation/methods/datatables/update-row
 */
class DataTablesUpdateRowRequest extends Request {
  get method() { return 'POST' }
  get path()   { return '/Api/DataTablesUpdateRow/' }

  constructor(apiKey, tableName, primaryKeys, row, options = {}) {
    super(apiKey, options)

    this.tableName = tableName
    this.primaryKeys = primaryKeys
    this.row = row
  }

  xmlData() {
    return [
      xml.tag('TableName', this.tableName),
      xml.tag('PrimaryKeyColumns',
        Object.keys(this.primaryKeys).map((pkColumnName) => {
          return xml.tag('Column', [
            xml.tag('Name', pkColumnName),
            xml.tag('Value', this.primaryKeys[pkColumnName])
          ])
        })
      ),
      xml.tag('Columns',
        Object.keys(this.row).map((columnName) => {
          return xml.tag('Column', [
            xml.tag('Name', columnName),
            xml.tag('Value', this.row[columnName])
          ])
        })
      )
    ]
  }
}

module.exports = DataTablesUpdateRowRequest
