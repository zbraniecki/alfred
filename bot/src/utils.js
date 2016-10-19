const fetch = require('node-fetch');

export function get(url) {
  return fetch(url).then(resp => resp.json());
}

export function post(url, body, ret) {
  const p = fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (ret === 'text') {
    return p.then(res => res.text());
  }
  if (ret === 'json') {
    return p.then(res => res.json());
  }
  return p;
}

export function del(url) {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
}
