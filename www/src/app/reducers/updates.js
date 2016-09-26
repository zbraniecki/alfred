import { types } from '../actions';

const defaultState = {
  inbox: [],
  done: [],
  goal: []
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case types.FETCH_UPDATES_BY_AUTHOR_COMPLETED:
      if (!action.error) {
        return {
          ...state,
          inbox: action.payload.updates
        };
      }
      break;

    default: return state;
  }

  return state;
}

