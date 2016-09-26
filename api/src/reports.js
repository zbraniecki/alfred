export function current(coll) {
  return function(req, res, next) {
    getCurrent(coll, req.query).then(function(reports) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(reports.reverse()));
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
