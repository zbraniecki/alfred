import { types } from '../actions';
import { makeReport } from '../utils';

const DAY = 1000 * 60 * 60 * 24;

const defaultState = {
  isFetching: false,
  recent: [],
  upcoming: []
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
        recent: [],
        upcoming: []
      };

    case types.RECEIVE_REPORTS: {
      const [next, ...recent] = action.payload.map(makeReport);
      const upcoming = next.reportDate - Date.now() < DAY ? [next] : [];
      return {
        ...state,
        isFetching: false,
        recent,
        upcoming
      };
    }

    default:
      return state;
  }
}
