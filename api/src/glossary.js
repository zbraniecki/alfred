import { ObjectID } from 'mongodb';

export function get(coll) {
  return function(req, res, next) {
    getUpdates(coll, req.query).then(
      updates => res.json(updates)
    ).catch(console.error);
  }
}

export function create(coll) {
  return function(req, res, next) {
    createTerm(coll, req.body)
      .then(resp => res.json(resp))
      .catch(console.error);
  }
}

export function update(coll) {
  return function(req, res, next) {
    updateTerm(coll, req.params.id, req.body).then(
      ({result}) => res.sendStatus(result.ok ? 200 : 500)
    ).catch(console.error);
  }
}

export function remove(coll) {
  return function(req, res, next) {
    removeTerm(coll, req.params.id).then(
      ({result}) => res.sendStatus(result.ok ? 200 : 500)
    ).catch(console.error);
  }
}

function getUpdates(coll, raw) {
  return coll.find({}).limit(1000).toArray();
}

function createTerm(coll, body) {
  delete body._id;

  if (!body.term) {
    return Promise.reject(new Error('Missing term'));
  }

  const o = Object.assign({
    desc: null,
    url: null
  }, body);
  return coll.insertOne(o).then(() => o);
}

function updateTerm(coll, id, body) {
  const _id = new ObjectID(id);
  return coll.update({_id}, { $set: body });
}

function removeTerm(coll, id) {
  const _id = new ObjectID(id);
  return coll.remove({_id});
}
