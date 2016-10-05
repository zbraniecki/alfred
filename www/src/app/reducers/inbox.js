import { types } from '../actions';
import { makeUpdate } from '../utils';

const defaultState = {
  isFetching: false,
  author: '',
  updates: [],
  prevReportDate: null,
  nextReportDate: null,
  nextReportSlug: ''
};

export default function(state = defaultState, action) {
  if (action.error) {
    console.error(action);
    return state;
  }

  switch (action.type) {
    case types.SET_AUTHOR:
      return {
        ...state,
        author: action.payload
      };

    case types.START_EDITING:
      return {
        ...state,
        updates: state.updates.map(up => {
          if (up._id === action.payload._id) {
            return {
              ...up,
              editable: true
            };
          }
          return up;
        })
      };

    case types.CANCEL_EDITING:
      return {
        ...state,
        updates: state.updates.map(up => {
          if (up._id === action.payload._id) {
            return {
              ...up,
              editable: false
            };
          }
          return up;
        })
      };

    case types.START_ADD: {
      const newUpdate = {
        _id: Date.now(),
        author: state.author,
        reportDate: state.nextReportDate,
        status: action.payload,
        text: '',
        resolved: false,
        editable: true,
        adding: true
      };
      return {
        ...state,
        updates: [ ...state.updates, newUpdate ]
      };
    }

    case types.CANCEL_ADD:
      return {
        ...state,
        updates: state.updates.filter(up => up._id !== action.payload._id)
      };

    case types.RECEIVE_UPDATE_CREATE:
      return {
        ...state,
        updates: state.updates.map(
          up => up._id === action.payload._id ?
            makeUpdate(action.payload) : up
        )
      };

    case types.REQUEST_CURRENT_REPORTS:
      return {
        ...state,
        isFetching: true,
      };

    case types.RECEIVE_CURRENT_REPORTS:
      return {
        ...state,
        prevReportDate: new Date(action.payload.prevReportDate),
        nextReportDate: new Date(action.payload.nextReportDate),
        nextReportSlug: action.payload.nextReportSlug
      };

    case types.RECEIVE_UPDATES_BY_AUTHOR:
      return {
        ...state,
        isFetching: false,
        updates: action.payload.map(up => makeUpdate(up))
      };

    case types.RECEIVE_UPDATE_PATCH: {
      const payload = makeUpdate(action.payload);
      return {
        ...state,
        updates: state.updates.map(
          update => update._id === payload._id ?
            { ...payload, editable: false } : update
        )
      };
    }

    case types.RECEIVE_UPDATE_RESOLVE: {
      const payload = makeUpdate(action.payload);
      return {
        ...state,
        updates: state.updates.map(
          update => update._id === payload.prev ?
            payload : update
        )
      };
    }

    default:
      return state;
  }
}

