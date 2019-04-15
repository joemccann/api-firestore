const Firestore = require('@google-cloud/firestore')

const PROJECTID = process.env.PROJECT || null

const db = new Firestore({ projectId: PROJECTID })

exports['api-firestore'] = async (req, res) => {
  const {
    body,
    query
  } = req

  if (req.method === 'POST') {
    const data = body || {}
    const {
      collection = '',
      document = '',
      update = false,
      value = {}
    } = data

    const ctime = Date.now()

    if (!collection) {
      return res.status(404).send({
        err: `Collection name required.`
      })
    }

    if (!document) {
      return res.status(404).send({
        err: `Document name required.`
      })
    }

    //
    // First, check to see if username exists and if it does, bail
    //
    try {
      const doc = await db.collection(collection).doc(document).get()

      if (doc && doc.exists && !update) {
        return res.status(404)
          .send({ err: `Document, ${document}, already exists.` })
      }
    } catch (err) {
      return { err: err.message || err }
    }

    try {
      const doc = await db.collection(collection).doc(document)

      let writeResult = null

      if (update) {
        delete data.update // Don't save this.
        writeResult = await doc.set({ ...value }, { merge: update })
      } else {
        writeResult = await doc.set({ ...value, ctime })
      }

      const write = writeResult.writeTime.toDate()

      if (write) return res.status(200).send({ data: 'OK' })

      return res.status(404).send({
        err: 'Write time not present from database.'
      })
    } catch (e) {
      return res.status(404).send({ err: e.message || e })
    }
  }

  if (req.method === 'DELETE') {
    let collection = query.collection || null
    let document = query.document || null

    if (!(collection && collection.length)) {
      return res.status(404).send({ err: 'Collection name is empty.' })
    }

    if (!(document && document.length)) {
      return res.status(404).send({ err: 'Document name is empty.' })
    }

    collection = collection.trim()
    document = document.trim()

    try {
      await db.collection(collection).doc(document).delete()
      return res.status(200).send({ data: `OK` })
    } catch (e) {
      return res.status(404).send({ err: e.message || e })
    }
  }

  let collection = query.collection || null
  let document = query.document || null
  const allDocs = query.allDocs || false

  if (!(collection && collection.length)) {
    return res.status(404).send({
      err: 'No collection name is present to query.'
    })
  }

  if (allDocs) {
    try {
      const snapshot = await db.collection(collection).get()

      const data = []
      snapshot.forEach(doc => {
        data.push(doc.data())
      })

      return res.status(200).send({ data })
    } catch (e) {
      return res.status(404).send({ err: e.message || e })
    }
  }

  if (!(document && document.length)) {
    return res.status(404).send({
      err: 'No document name is present to query.'
    })
  }

  try {
    const doc = await db.collection(collection).doc(document).get()

    if (!(doc && doc.exists)) {
      return res.status(404)
        .send({ err: `Unable to find the document for ${document}.` })
    }

    const data = doc.data()

    return res.status(200).send({ data })
  } catch (e) {
    return res.status(404).send({ err: e.message || e })
  }
}
