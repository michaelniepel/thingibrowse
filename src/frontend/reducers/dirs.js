import { RECEIVED_DIRS } from '../constants';

const initialState = [];

const actionsMap = {
  [RECEIVED_DIRS]: (state, action) => action.dirs
};

export default function dirs(state = initialState, action) {
  const fn = actionsMap[action.type];
  if (!fn) {
    return state;
  }
  return fn(state, action);
}
