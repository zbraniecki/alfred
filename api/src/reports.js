export function current(coll) {
  return function(req, res, next) {
    getCurrent(coll, req.query).then(function(reports) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(reports.reverse()));
    }).catch(console.error);
  }
}

export function create(coll) {
  return function(req, res, next) {
    createReport(coll, req.body).then(function({ops}) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(ops[0]));
    }).catch(console.error);
  }
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
  const reportDate = new Date(body.date);
  const year = reportDate.getUTCFullYear();
  const month = reportDate.getUTCMonth() + 1;
  const day = reportDate.getUTCDate();
  const slug = `${year}-${pad(month)}-${pad(day)}`;
  return coll.insert(Object.assign(body, {
    slug,
    reportDate
  }));
}
