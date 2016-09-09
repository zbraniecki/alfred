import express from 'express';

export function createRouter(db) {
  const router = express.Router();
  const updates = db.collection('updates');
  router.route('/updates').get(createNotes(updates));
  return router;
}

export function createNotes(coll) {
  return function(req, res, next) {
    find(coll, req.query).then(function(updates) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(updates));
    }).catch(console.error);
  }
}

function find(coll, query) {
  return coll.find(query).limit(1000).toArray();
}
