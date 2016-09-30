import * as alf from '../services/alfred-api-service';

export const types = {
  // user
  SET_AUTHOR:                        'SET_AUTHOR',

  //ui
  SET_EDITING:                       'SET_EDITING',
  CANCEL_EDITING:                    'CANCEL_EDITING',

  // updates
  REQUEST_UPDATES_BY_AUTHOR:         'REQUEST_UPDATES_BY_AUTHOR',
  RECEIVE_UPDATES_BY_AUTHOR:         'RECEIVE_UPDATES_BY_AUTHOR',
  PATCH_UPDATE:                      'PATCH_UPDATE',
  PATCH_UPDATE_COMPLETED:            'PATCH_UPDATE_COMPLETED',

  // reports
  REQUEST_CURRENT_REPORTS:           'REQUEST_CURRENT_REPORTS',
  RECEIVE_CURRENT_REPORTS:           'RECEIVE_CURRENT_REPORTS'
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

export function setEditing(update) {
  return createAction(types.SET_EDITING, update);
}

export function cancelEditing(update) {
  return createAction(types.CANCEL_EDITING, update);
}

export function fetchCurrentReports() {
  return createAsyncAction(types.REQUEST_CURRENT_REPORTS,
                           types.RECEIVE_CURRENT_REPORTS,
                           () => {
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
  return createAsyncAction(types.REQUEST_UPDATES_BY_AUTHOR,
                           types.RECEIVE_UPDATES_BY_AUTHOR,
                           () => {
    return Promise.all([
      alf.fetchCurrentUpdatesByAuthor(author),
      alf.fetchPrevUpdatesByAuthor(author, slug),
      alf.fetchNextUpdatesByAuthor(author, slug)
    ]).then(([current, prev, next]) => {
      return [ ...current, ...prev, ...next ];
    });
  });
}

export function patchUpdate(update) {
  return createAsyncAction(types.PATCH_UPDATE,
                           types.PATCH_UPDATE_COMPLETED,
                           () => {
    return alf.patchUpdate(update).then(() => update);
  });
}

