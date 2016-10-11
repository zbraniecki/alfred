export function insert(coll) {
  return function(req, res, next) {
    insertLog(coll, req.body).then(
      (resp) => res.json(resp)
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}

export function get(coll) {
  return function(req, res, next) {
    getLastItem(coll, req.author, req.channel).then(
      (resp) => res.json(resp)
    ).catch(
      err => res.status(500).send(err.message)
    );
  }
}


function insertLog(coll, body) {
  let ts = Date.now();
  let o = Object.assign(body, {
    ts
  });
  return coll.insertOne(o).then(() => {
    return o._id;
  });
}

function getLastItem(coll, author, channel) {
  return coll.find({
    author: author,
    channel: channel
  }).sort({
    ts: -1
  }).limit(1);
}
