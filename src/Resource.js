import inflection from 'inflection'

import Collection from './Collection'

export default class Resource extends Collection {
  constructor (parent, name, options, fn) {
    super(parent, name, options, fn)

    this.finders = [
      { name: 'findOne', method: 'GET', path: '{id}' },
      { name: 'findAll', method: 'GET', path: null },
      { name: 'create', method: 'POST', path: null },
      { name: 'update', method: 'PUT', path: '{id}' },
      { name: 'delete', method: 'DELETE', path: '{id}' }
    ]
  }

  key () {
    return '{' + (this.options.key || `${inflection.singularize(this.name)}Id`) + '}'
  }
}
