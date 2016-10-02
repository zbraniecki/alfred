import * as alf from '../services/alfred-api-service';
import { makeUpdate, createAction, createAsyncAction } from '../utils';

export const types = {
  // user
  SET_AUTHOR:                        'SET_AUTHOR',

  //ui
  START_EDITING:                     'START_EDITING',
  CANCEL_EDITING:                    'CANCEL_EDITING',
  START_ADD:                         'START_ADD',
  CANCEL_ADD:                        'CANCEL_ADD',

  // updates
  REQUEST_UPDATES_BY_AUTHOR:         'REQUEST_UPDATES_BY_AUTHOR',
  RECEIVE_UPDATES_BY_AUTHOR:         'RECEIVE_UPDATES_BY_AUTHOR',
  REQUEST_UPDATE_PATCH:              'REQUEST_UPDATE_PATCH',
  RECEIVE_UPDATE_PATCH:              'RECEIVE_UPDATE_PATCH',
  REQUEST_UPDATE_CREATE:             'REQUEST_UPDATE_CREATE',
  RECEIVE_UPDATE_CREATE:             'RECEIVE_UPDATE_CREATE',
  REQUEST_UPDATE_RESOLVE:            'REQUEST_UPDATE_RESOLVE',
  RECEIVE_UPDATE_RESOLVE:            'RECEIVE_UPDATE_RESOLVE',

  // reports
  REQUEST_CURRENT_REPORTS:           'REQUEST_CURRENT_REPORTS',
  RECEIVE_CURRENT_REPORTS:           'RECEIVE_CURRENT_REPORTS'
}

export function setAuthor(author) {
  return createAction(types.SET_AUTHOR, author);
}

export function setEditing(update) {
  return createAction(types.START_EDITING, update);
}

export function cancelEditing(update) {
  return createAction(types.CANCEL_EDITING, update);
}

export function startAdd(status) {
  return createAction(types.START_ADD, status);
}

export function cancelAdd(update) {
  return createAction(types.CANCEL_ADD, update);
}

export function fetchCurrentReports() {
  return createAsyncAction(
    types.REQUEST_CURRENT_REPORTS,
    types.RECEIVE_CURRENT_REPORTS,
    () => alf.fetchCurrentReports().then(
      ([prevReport, nextReport]) => {
        return {
          prevReportDate: prevReport.reportDate,
          nextReportDate: nextReport.reportDate,
          nextReportSlug: nextReport.slug
        };
      }
    )
  );
}

export function fetchUpdatesByAuthor(author, slug) {
  return createAsyncAction(
    types.REQUEST_UPDATES_BY_AUTHOR,
    types.RECEIVE_UPDATES_BY_AUTHOR,
    () => {
      return Promise.all([
        alf.fetchCurrentUpdatesByAuthor(author),
        alf.fetchPrevUpdatesByAuthor(author, slug),
        alf.fetchNextUpdatesByAuthor(author, slug)
      ]).then(
        ([current, prev, next]) => [ ...current, ...prev, ...next ]
      );
    }
  );
}

export function patchUpdate(update) {
  return createAsyncAction(
    types.REQUEST_UPDATE_PATCH,
    types.RECEIVE_UPDATE_PATCH,
    () => alf.patchUpdate(update).then(() => update)
  );
}

export function createUpdate(update) {
  return createAsyncAction(
    types.REQUEST_UPDATE_CREATE,
    types.RECEIVE_UPDATE_CREATE,
    () => alf.createUpdate(makeUpdate(update)).then(() => update)
  );
}

export function resolveUpdate(body) {
  return createAsyncAction(
    types.REQUEST_UPDATE_RESOLVE,
    types.RECEIVE_UPDATE_RESOLVE,
    () => alf.resolveUpdate(body).then(update => update)
  );
}

