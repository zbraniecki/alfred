export function get(url) {
  return fetch(url).then(resp => resp.json());
}

export function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  });
}

const dtf = Intl.DateTimeFormat('en', {
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

export function reportName(date) {
  return dtf.format(date);
}

export function makeUpdate(up) {
  return {
    _id: up._id,
    author: up.author,
    channel: up.channel,
    status: up.status,
    resolved: up.resolved,
    text: up.text,
    createdAt: new Date(up.createdAt),
    reportDate: new Date(up.reportDate),
    prev: up.prev
  };
}
