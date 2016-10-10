const fetch = require('node-fetch');

export function get(url) {
  return fetch(url).then(resp => resp.json());
}

export function post(url, body) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
}

