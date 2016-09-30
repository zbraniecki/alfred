import { types } from '../actions';

const defaultState = {
  author: '',
  updates: [],
  prevReportDate: null,
  nextReportDate: null,
  nextReportSlug: ''
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.SET_AUTHOR:
      return {
        ...state,
        author: action.payload
      };

    case types.SET_EDITING:
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

    case types.RECEIVE_CURRENT_REPORTS:
      if (!action.error) {
        return {
          ...state,
          prevReportDate: new Date(action.payload.prevReportDate),
          nextReportDate: new Date(action.payload.nextReportDate),
          nextReportSlug: action.payload.nextReportSlug
        };
      }
      break;

    case types.RECEIVE_UPDATES_BY_AUTHOR:
      if (!action.error) {
        return {
          ...state,
          updates: action.payload
        };
      }
      break;

    case types.PATCH_UPDATE_COMPLETED:
      if (!action.error) {
        return {
          ...state,
          updates: state.updates.map(
            update => update._id === action.payload._id ?
              { ...action.payload, editable: false } : update
          )
        };
      }
      break;

    default: return state;
  }

  return state;
}
