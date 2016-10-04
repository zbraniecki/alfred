import { types } from '../actions';

const defaultState = {
  updates: [],
  reportDate: null,
  reportSlug: ''
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.FETCH_CURRENT_REPORTS_COMPLETED:
      if (!action.error) {
        return {
          ...state,
          reportDate: action.payload.nextReportDate,
          reportSlug: action.payload.nextReportSlug
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

