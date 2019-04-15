const test = require('tape')
const { 'api-firestore': firestore } = require('.')

//
// Create a mock request and response method
//

function status (code) {
  this.statusCode = code
  return this
}

function send (obj) {
  const body = { ...this, ...obj }
  return body
}

const res = {
  status,
  send
}

const collection = 'mock1'
const document = 'mock-doc-1'
const value = {
  name: 'joe',
  email: 'foo@bar.com',
  connections: ['a', 'b', 'c']
}

test('sanity', t => {
  t.ok(true)
  t.end()
})

test('pass - POST new mock document', async t => {
  const req = {
    method: 'POST',
    body: {
      collection,
      document,
      value
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.equals(data, 'OK')
  t.end()
})

test('fail - POST new document, missing collection name', async t => {
  const req = {
    method: 'POST',
    body: {
      document
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Collection name required.`)
  t.end()
})

test('fail - POST new document, missing document', async t => {
  const req = {
    method: 'POST',
    body: {
      collection
    }
  }

  const { err, data, statusCode } = await firestore(req, res)

  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Document name required.`)
  t.end()
})

test('pass - GET user by document name', async t => {
  const req = {
    method: 'GET',
    query: {
      collection,
      document
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(!err)
  t.ok(data)

  delete data.ctime

  t.equals(statusCode, 200)
  t.deepEqual(data, value)
  t.end()
})

test('fail - GET user by document name', async t => {
  const req = {
    method: 'GET',
    query: {
      collection,
      document: 'xxx'
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, 'Unable to find the document for xxx.')
  t.end()
})

test('pass - POST update document', async t => {
  const req = {
    method: 'POST',
    body: {
      collection,
      document,
      value: {
        phone: '+1-525-555-1111'
      },
      update: true
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.equals(data, 'OK')
  t.end()
})

test('pass - GET user by document, verify update', async t => {
  const req = {
    method: 'GET',
    query: {
      collection,
      document
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(!err)
  t.ok(data)

  const valid = { ...value, phone: '+1-525-555-1111' }

  delete data.ctime

  t.equals(statusCode, 200)
  t.deepEqual(data, valid)
  t.end()
})

test('fail - POST update document, document already exists', async t => {
  const req = {
    method: 'POST',
    body: {
      collection,
      document,
      update: false
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, `Document, ${document}, already exists.`)
  t.end()
})

test('pass - DELETE user by document', async t => {
  const req = {
    method: 'DELETE',
    query: {
      collection,
      document
    }
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(!err)
  t.ok(data)
  t.equals(statusCode, 200)
  t.deepEqual(data, 'OK')
  t.end()
})

test('fail - DELETE user by document, no document or collection', async t => {
  const req = {
    method: 'DELETE',
    query: {}
  }

  const { err, data, statusCode } = await firestore(req, res)
  t.ok(err)
  t.ok(!data)
  t.equals(statusCode, 404)
  t.equals(err, 'Collection name is empty.')
  t.end()
})
