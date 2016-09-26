import * as alf from '../services/alfred-api-service';

export const types = {
  SET_AUTHOR: 'SET_AUTHOR',
  FETCH_UPDATES_BY_AUTHOR: 'FETCH_UPDATES_BY_AUTHOR',
  FETCH_UPDATES_BY_AUTHOR_COMPLETED: 'FETCH_UPDATES_BY_AUTHOR_COMPLETED',
  POST_REPORT: 'POST_REPORT',
  POST_REPORT_COMPLETED: 'POST_REPORT_COMPLETED'
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

export function fetchUpdatesByAuthor(author) {
  return createAsyncAction(types.FETCH_UPDATES_BY_AUTHOR, types.FETCH_UPDATES_BY_AUTHOR_COMPLETED, () => {
    return alf.fetchUpdatesByAuthor(author).then(updates => {
      return updates;
    });
  });
}

export function postReport() {
  return createAsyncAction(types.POST_REPORT, types.POST_REPORT_COMPLETED, () => {
    return alf.postReport().then(report => {
      return report;
    });
  });
}

