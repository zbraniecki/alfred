import { get, post } from '../utils';

const { REACT_APP_API_URL } = process.env;

export function fetchCurrentUpdatesByAuthor(author) {
  const updatesByAuthor = `${REACT_APP_API_URL}/updates?author=${author}`;
    return get(`${updatesByAuthor}&resolved=0&status=inbox&status=event&status=todo&status=done`);
}

export function fetchPrevUpdatesByAuthor(author, reportSlug) {
  const updatesByAuthor = `${REACT_APP_API_URL}/updates?author=${author}`;
  return get(`${updatesByAuthor}&resolved=0&status=goal&before=${reportSlug}`);
}

export function fetchNextUpdatesByAuthor(author, reportSlug) {
  const updatesByAuthor = `${REACT_APP_API_URL}/updates?author=${author}`;
  return get(`${updatesByAuthor}&report=${reportSlug}&status=goal&status=struggle&status=achievement`);
}

export function fetchReports() {
  return get(`${REACT_APP_API_URL}/reports`);
}

export function fetchCurrentReports() {
  return get(`${REACT_APP_API_URL}/reports/current`);
}

export function patchUpdate(update) {
  const edit = {
    text: update.text
  };
  return post(`${REACT_APP_API_URL}/updates/${update._id}`, edit);
}

export function createUpdate(update) {
  return post(`${REACT_APP_API_URL}/updates`, update).then(res => res.json());
}

export function resolveUpdate(body) {
  return post(`${REACT_APP_API_URL}/resolve`, body).then(res => res.json());
}

