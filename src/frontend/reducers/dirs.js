import { RECEIVED_DIRS, REQUEST_DIRS } from '../constants';

const initialState = {
  isFetching: false,
  items: [],
};


const actionsMap = {
  [REQUEST_DIRS]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: true
    });
  },
  [RECEIVED_DIRS]: (state, action) => {
    return Object.assign({}, state, {
      isFetching: false,
      items: action.dirs,
      lastUpdated: action.receivedAt,
    });
  }
};


export default function dirs(state = initialState, action) {
  const fn = actionsMap[action.type];
  if (!fn) {
    return state;
  }
  return fn(state, action);
}
