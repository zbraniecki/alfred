import { ObjectID } from 'mongodb';

export function get(coll) {
  return function(req, res, next) {
    getAll(coll, req.query).then(
      reports => res.json(reports)
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

export function current(coll) {
  return function(req, res, next) {
    getCurrent(coll, req.query).then(
      reports => res.json(reports.reverse())
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

export function create(coll) {
  return function(req, res, next) {
    createReport(coll, req.body).then(
      (resp) => res.json(resp)
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

export function remove(coll) {
  return function(req, res, next) {
    removeReport(coll, req.params.id).then(
      ({result}) => res.sendStatus(result.ok ? 200 : 500)
    ).catch(console.error);
  }
}


// get all reports, the most recent first
function getAll(coll) {
  return coll.find({}, {
    _id: 0
  }).sort({
    reportDate: -1
  }).limit(200).toArray();
}

// get the previous and the next report
function getCurrent(coll) {
  // XXX seriously? - yup.
  return coll.find({}, {
    _id: 0
  }).sort({
    reportDate: -1
  }).limit(2).toArray();
}

function pad(str) {
  return ('00'+str).slice(-2);
}

function createReport(coll, body) {
  // XXX should we instead accept date slugs in the request?
  const ts = Date.parse(body.date);

  if (isNaN(ts)) {
    return Promise.reject(new Error('Invalid date'));
  }

  const reportDate = new Date(ts);
  const year = reportDate.getUTCFullYear();
  const month = reportDate.getUTCMonth() + 1;
  const day = reportDate.getUTCDate();
  const slug = `${year}-${pad(month)}-${pad(day)}`;

  const o = Object.assign(body, {
    slug,
    reportDate
  });
  return coll.insertOne(o).then(() => o);
}

function removeReport(coll, id) {
  const _id = new ObjectID(id);
  return coll.remove({_id});
}
