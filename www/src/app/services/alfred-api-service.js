import { API_URL } from '../../config';
import { get } from '../utils';


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

