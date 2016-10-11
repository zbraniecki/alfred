import { types } from '../actions';
import { makeReport } from '../utils';

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
      const [upcoming, ...recent] = action.payload.map(makeReport);
      return {
        ...state,
        isFetching: false,
        recent,
        upcoming: [upcoming]
      };
    }

    default:
      return state;
  }
}
