import express from 'express';
import bodyParser from 'body-parser';

import * as reports from './reports';
import * as updates from './updates';
import * as glossary from './glossary';

export default function createRouter(db) {
  const router = express.Router();
  const reportsColl = db.collection('reports');
  const updatesColl = db.collection('updates');
  const glossaryColl = db.collection('glossary');

  router.use(cors);
  router.use(bodyParser.json());

  router.route('/reports').get(reports.get(reportsColl));
  router.route('/reports/current').get(reports.current(reportsColl));
  router.route('/reports').post(reports.create(reportsColl));
  router.route('/reports/:id').delete(reports.remove(reportsColl));

  router.route('/updates').get(updates.get(updatesColl));
  router.route('/updates').post(updates.create(updatesColl));
  router.route('/updates/:id').delete(updates.remove(updatesColl));
  router.route('/updates/:id').post(updates.update(updatesColl));
  router.route('/resolve').post(updates.resolve(updatesColl));

  router.route('/glossary').get(glossary.get(glossaryColl));
  router.route('/glossary').post(glossary.create(glossaryColl));
  router.route('/glossary/:id').delete(glossary.remove(glossaryColl));
  router.route('/glossary/:id').post(glossary.update(glossaryColl));
  return router;
}

function cors(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
