import { API_URL } from '../../config';
import { get, post } from '../utils';


export function fetchUpdatesByAuthor(author) {
  const updatesByAuthor = `${API_URL}/updates?author=${author}`;
  const currentReportsInfo = `${API_URL}/reports/current`;

  return get(currentReportsInfo).then(([prevReport, nextReport]) => {
    return Promise.all([
        prevReport, nextReport,
        get(`${updatesByAuthor}&resolved=0&status=inbox&status=event&status=todo&status=done`),
        get(`${updatesByAuthor}&resolved=0&status=goal&before=${nextReport.slug}`),
        get(`${updatesByAuthor}&report=${nextReport.slug}&status=goal&status=struggle&status=achievement`),
      ])
    }).then(([prevReport, nextReport, current, prev, next]) => {
      return {
        prevReportDate: new Date(prevReport.reportDate),
        nextReportDate: new Date(nextReport.reportDate),
        nextReportSlug: nextReport.slug,
        updates: [...current, ...prev, ...next]
      }
    }).catch(console.error);
}

export function postReport() {
  const date = new Date();
  return post(`${API_URL}/reports`, {date});
}

