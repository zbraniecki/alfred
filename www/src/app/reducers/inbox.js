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

    case types.FETCH_CURRENT_REPORTS_COMPLETED:
      if (!action.error) {
        return {
          ...state,
          prevReportDate: new Date(action.payload.prevReportDate),
          nextReportDate: new Date(action.payload.nextReportDate),
          nextReportSlug: action.payload.nextReportSlug
        };
      }
      break;

    case types.FETCH_UPDATES_BY_AUTHOR_COMPLETED:
      if (!action.error) {
        return {
          ...state,
          updates: action.payload
        };
      }
      break;

    default: return state;
  }

  return state;
}
