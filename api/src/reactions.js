export function get(coll) {
  return function(req, res, next) {
    getAll(coll, req.query).then(
      reports => res.json(reports)
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

export function add(coll) {
  return function(req, res, next) {
    addReaction(coll, req.body).then(
      ({ops}) => res.json(ops[0])
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

function addReaction(coll, body) {
  return coll.insert({
    author: body.author,
    item: body.id,
    type: body.type
  });
}
