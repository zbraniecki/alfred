import { ObjectID } from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';

export function createRouter(db) {
  const router = express.Router();
  router.use(cors);
  router.use(bodyParser.json());
  const updates = db.collection('updates');
  router.route('/updates').get(getUpdates(updates))
  router.route('/updates/:id').post(postUpdate(updates))
  router.route('/resolve').post(resolveUpdate(updates));
  return router;
}

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}

export function getUpdates(coll) {
  return function(req, res, next) {
    find(coll, req.query).then(function(updates) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(updates));
    }).catch(console.error);
  }
}

export function postUpdate(coll) {
  return function(req, res, next) {
    update(coll, req.params.id, req.body).then(function({result}) {
      res.sendStatus(result.ok ? 200 : 500);
    }).catch(console.error);
  }
}

export function resolveUpdate(coll) {
  return function(req, res, next) {
    resolve(coll, req.body).then(function({ops}) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ops[0]));
    }).catch(console.error);
  }
}

function find(coll, raw) {
  const query = {};

  if ('author' in raw) {
    query.author = raw.author;
  }

  if ('status' in raw) {
    query.status = Array.isArray(raw.status) ?
      { $in: raw.status } : raw.status;
  }

  if ('resolved' in raw) {
    query.resolved = raw.resolved === '1';
  }

  if ('report' in raw) {
    query.reportDate = new Date(raw.report);
  } else if ('before' in raw) {
    query.reportDate = { $lt: new Date(raw.before) };
  }

  return coll.find(query).limit(1000).toArray();
}

function update(coll, id, body) {
  const _id = new ObjectID(id);
  return coll.update({_id}, { $set: body });
}

function resolve(coll, body) {
  const _id = new ObjectID(body._id);
  return coll.update({_id}, { $set: { resolved: true } }).then(
    () => coll.findOne({_id}, {_id: 0})
  ).then(parent => {
    const child = Object.assign({}, parent, {
      prev: _id,
      status: body.status,
      reportDate: new Date(body.reportDate),
      resolved: false,
    });
    return coll.insert(child);
  });
}
