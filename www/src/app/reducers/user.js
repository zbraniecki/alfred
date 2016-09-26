import { types } from '../actions';

export default function(state={}, action) {
  switch (action.type) {
    case types.SET_AUTHOR:
      return {
        ...state,
        author: action.payload
      };

    default: return state;
  }
}
