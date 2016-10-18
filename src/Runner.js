import Namespace from './Namespace'
import Resources from './Resources'
import Root from './Root'

export default class Duxy {
  constructor (options = {}) {
    this.options = options

    this.root = new Root(this, options.http)
    this.stack = [this.root]

    // NOTE(vesln): DSL methods
    this.resources = this.resources.bind(this)
    this.namespace = this.namespace.bind(this)
    this.get = this.get.bind(this)
    this.post = this.post.bind(this)
    this.put = this.put.bind(this)
    this.patch = this.patch.bind(this)
    this.del = this.del.bind(this)
    this.map = this.map.bind(this)
  }

  resources (name, options, fn) {
    const resources = new Resources(this.current, name, options, fn)
    this.current.runnables.push(resources)

    this.stack.push(resources)
    resources.run()
    this.stack.pop()
  }

  namespace (name, options, fn) {
    const namespace = new Namespace(this.current, name, options, fn)
    this.current.runnables.push(namespace)

    this.stack.push(namespace)
    namespace.run()
    this.stack.pop()
  }

  get (name) {
    this.member(name, 'GET')
  }

  post (name) {
    this.member(name, 'POST')
  }

  put (name) {
    this.member(name, 'PUT')
  }

  patch (name) {
    this.member(name, 'PATCH')
  }

  del (name) {
    this.member(name, 'DELETE')
  }

  map (name, fn) {
    this.current.members.push({ name, call: fn })
  }

  get current () {
    return this.stack[this.stack.length - 1]
  }

  draw (fn) {
    this.root.run(fn)
    return this.stack[0].draw({})
  }

  member (name, method) {
    this.current.members.push({ name, path: name, method, force: true })
  }
}
