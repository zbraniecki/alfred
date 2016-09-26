export function next(coll) {
  return function(req, res, next) {
    getNext(coll, req.query).then(function(reports) {
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(reports[0]));
    }).catch(console.error);
  }
}

function getNext(coll) {
  // XXX seriously? - yup.
  return coll.find({}, {
    _id: 0
  }).sort({
    reportDate: -1
  }).limit(1).toArray();
}
