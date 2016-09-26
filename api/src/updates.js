export function get(coll) {
  return function(req, res, next) {
    getUpdates(coll, req.query).then(function(updates) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(updates));
    }).catch(console.error);
  }
}

export function create(coll) {
  return function(req, res, next) {
    createUpdate(coll, req.body).then(function({ops}) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ops[0]));
    }).catch(console.error);
  }
}

export function update(coll) {
  return function(req, res, next) {
    updateUpdate(coll, req.params.id, req.body).then(function({result}) {
      res.sendStatus(result.ok ? 200 : 500);
    }).catch(console.error);
  }
}

export function resolve(coll) {
  return function(req, res, next) {
    resolveUpdate(coll, req.body).then(function({ops}) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ops[0]));
    }).catch(console.error);
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
  return coll.insert(Object.assign(body, {
    createdAt: new Date(),
    reportDate: new Date(body.reportDate)
  }));
}

function updateUpdate(coll, id, body) {
  const _id = new ObjectID(id);
  return coll.update({_id}, { $set: body });
}

function resolveUpdate(coll, body) {
  const _id = new ObjectID(body._id);
  return coll.update({_id}, {
    $set: {
      resolved: true,
      resolveDate: new Date(),
    }
  }).then(
    () => coll.findOne({_id}, {_id: 0})
  ).then(parent => {
    const { status, reportDate } = body;
    const child = Object.assign({}, parent, {
      prev: _id,
      status: status,
      createdAt: new Date(),
      reportDate: reportDate ? new Date(reportDate) : null,
      resolved: false,
    });
    return coll.insert(child);
  });
}
