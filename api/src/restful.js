import express from 'express';
import bodyParser from 'body-parser';

import * as reports from './reports';
import * as updates from './updates';
import * as reactions from './reactions';

export default function createRouter(db) {
  const router = express.Router();
  const reportsColl = db.collection('reports');
  const updatesColl = db.collection('updates');
  const reactionscoll = db.collections('reactions');

  router.use(cors);
  router.use(bodyParser.json());

  router.route('/reports').get(reports.get(reportsColl));
  router.route('/reports/current').get(reports.current(reportsColl));
  router.route('/reports').post(reports.create(reportsColl));

  router.route('/updates').get(updates.get(updatesColl));
  router.route('/updates').post(updates.create(updatesColl));
  router.route('/updates/:id').post(updates.update(updatesColl));
  router.route('/resolve').post(updates.resolve(updatesColl));

  router.route('/reactions/add').post(reactions.add(reactionscoll));
  return router;
}

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
