import * as alf from '../services/alfred-api-service';

export const types = {
  // user
  SET_AUTHOR:                        'SET_AUTHOR',

  // updates
  FETCH_UPDATES_BY_AUTHOR:           'FETCH_UPDATES_BY_AUTHOR',
  FETCH_UPDATES_BY_AUTHOR_COMPLETED: 'FETCH_UPDATES_BY_AUTHOR_COMPLETED',

  // reports
  FETCH_CURRENT_REPORTS:             'FETCH_CURRENT_REPORTS',
  FETCH_CURRENT_REPORTS_COMPLETED:   'FETCH_CURRENT_REPORTS_COMPLETED'
}

function createAction(type, payload) {
  let error = payload instanceof Error;

  return {
    type,
    payload,
    error
  };
}

function createAsyncAction(startType, completeType, asyncFn) {
  return (dispatch) => {
    dispatch(createAction(startType));

    let actionCompleted = createAction.bind(null, completeType);
    return asyncFn(dispatch).then((data) => {
      dispatch(actionCompleted(data));
      return data;
    }).catch((error) => {
      dispatch(actionCompleted(error));
      throw error;
    });
  };
}

export function setAuthor(author) {
  return createAction(types.SET_AUTHOR, author);
}

export function fetchCurrentReports() {
  return createAsyncAction(types.FETCH_CURRENT_REPORTS, types.FETCH_CURRENT_REPORTS_COMPLETED, () => {
    return alf.fetchCurrentReports().then(([prevReport, nextReport]) => {
      return {
        prevReportDate: prevReport.reportDate,
        nextReportDate: nextReport.reportDate,
        nextReportSlug: nextReport.slug
      };
    })
  })
}

export function fetchUpdatesByAuthor(author, slug) {
  return createAsyncAction(types.FETCH_UPDATES_BY_AUTHOR, types.FETCH_UPDATES_BY_AUTHOR_COMPLETED, () => {
    return Promise.all([
      alf.fetchCurrentUpdatesByAuthor(author),
      alf.fetchPrevUpdatesByAuthor(author, slug),
      alf.fetchNextUpdatesByAuthor(author, slug)
    ]).then(([current, prev, next]) => {
      return [ ...current, ...prev, ...next ];
    });
  });
}

