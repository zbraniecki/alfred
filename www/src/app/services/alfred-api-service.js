import { API_URL } from '../../config';
import { get, post } from '../utils';


export function fetchCurrentUpdatesByAuthor(author) {
  const updatesByAuthor = `${API_URL}/updates?author=${author}`;
    return get(`${updatesByAuthor}&resolved=0&status=inbox&status=event&status=todo&status=done`);
}

export function fetchPrevUpdatesByAuthor(author, reportSlug) {
  const updatesByAuthor = `${API_URL}/updates?author=${author}`;
  return get(`${updatesByAuthor}&resolved=0&status=goal&before=${reportSlug}`);
}

export function fetchNextUpdatesByAuthor(author, reportSlug) {
  const updatesByAuthor = `${API_URL}/updates?author=${author}`;
  return get(`${updatesByAuthor}&report=${reportSlug}&status=goal&status=struggle&status=achievement`);
}

export function fetchCurrentReports() {
  return get(`${API_URL}/reports/current`);
}

export function patchUpdate(update) {
  const edit = {
    text: update.text
  };
  return post(`${API_URL}/updates/${update._id}`, edit);
}

export function postUpdate(update) {
  return post(`${API_URL}/updates`, update).then(res => res.json());
}

export function resolveUpdate(body) {
  return post(`${API_URL}/resolve`, body).then(res => res.json());
}

