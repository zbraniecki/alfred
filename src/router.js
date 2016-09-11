import { ObjectID } from 'mongodb';
import express from 'express';
import bodyParser from 'body-parser';

export function createRouter(db) {
  const router = express.Router();
  router.use(cors);
  router.use(bodyParser.json());
  const updates = db.collection('updates');
  router.route('/updates').get(getUpdates(updates))
  router.route('/updates/:id').post(postUpdate(updates));
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
    update(coll, req.params.id, req.body).then(function() {
      res.sendStatus(200);
    }).catch(console.error);
  }
}

function find(coll, query) {
  return coll.find(query).limit(1000).toArray();
}

function update(coll, id, body) {
  return coll.update({_id: new ObjectID(id)}, {
    $set: {
      reportDate: new Date(body.reportDate),
      status: body.status
    }
  });
}
