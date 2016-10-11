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
    createUpdate(coll, req.body)
      .then(resp => res.json(resp))
      .catch(console.error);
  }
}

export function update(coll) {
  return function(req, res, next) {
    updateUpdate(coll, req.params.id, req.body).then(
      ({result}) => res.sendStatus(result.ok ? 200 : 500)
    ).catch(console.error);
  }
}

export function remove(coll) {
  return function(req, res, next) {
    removeUpdate(coll, req.params.id).then(
      ({result}) => res.sendStatus(result.ok ? 200 : 500)
    ).catch(console.error);
  }
}

export function resolve(coll) {
  return function(req, res, next) {
    resolveUpdate(coll, req.body).then(
      ({ops}) => res.json(ops[0])
    ).catch(console.error);
  }
}

function getUpdates(coll, raw) {
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

function createUpdate(coll, body) {
  delete body._id;
  const d = new Date();

  let o = Object.assign(body, {
    createdAt: d,
    firstCreatedAt: d,
    reportDate: new Date(body.reportDate)
  });
  return coll.insertOne(o).then(() => {
    return o._id;
  })
}

function updateUpdate(coll, id, body) {
  const _id = new ObjectID(id);
  return coll.update({_id}, { $set: body });
}

function removeUpdate(coll, id) {
  const _id = new ObjectID(id);
  return coll.remove({_id});
}

function resolveUpdate(coll, body) {
  const _id = new ObjectID(body._id);
  return coll.update({_id}, {
    $set: {
      resolved: true,
    }
  }).then(
    () => coll.findOne({_id}, {_id: 0})
  ).then(parent => {
    const { status, reportDate } = body;
    // the 'archived' and 'removed' states are terminal and the new update 
    // should be resolved: true
    const resolved = status === 'archived' || status === 'removed';
    const child = Object.assign({}, parent, {
      prev: _id,
      status: status,
      createdAt: new Date(),
      reportDate: reportDate ? new Date(reportDate) : null,
      resolved
    });
    return coll.insert(child);
  });
}
