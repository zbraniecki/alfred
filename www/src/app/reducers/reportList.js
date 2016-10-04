import { types } from '../actions';
import { makeReport } from '../utils';

const defaultState = {
  isFetching: false,
  reports: []
};

export default function(state = defaultState, action) {
  if (action.error) {
    console.error(action);
    return state;
  }

  switch (action.type) {
    case types.REQUEST_REPORTS:
      return {
        ...state,
        isFetching: true,
        reports: []
      };

    case types.RECEIVE_REPORTS:
      return {
        ...state,
        isFetching: false,
        reports: action.payload.map(makeReport)
      };

    default:
      return state;
  }
}

