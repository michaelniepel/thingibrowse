import { RECEIVED_DIRS, REQUEST_DIRS } from '../constants';

const initialState = {
  isFetching: false,
  items: [],
  path: []
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
      items: action.path.length == 0 ? action.dirs : ['..', ...action.dirs],
      lastUpdated: action.receivedAt,
      path: action.path
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
