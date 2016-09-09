import express from 'express';

export function createRouter(db) {
  const router = express.Router();
  const notes = db.collection('notes');
  router.route('/notes').get(createNotes(notes));
  return router;
}

export function createNotes(coll) {
  return function(req, res, next) {
    find(coll, req.query).then(function(notes) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(notes));
    }).catch(console.error);
  }
}

function find(coll, query) {
  return coll.find({}).limit(1000).toArray();
}
