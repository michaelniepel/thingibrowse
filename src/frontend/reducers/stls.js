import { RECEIVED_STL, REQUEST_STL } from '../constants';

const initialState = {
  items: {},
};


const actionsMap = {
  [REQUEST_STL]: (state, action) => {
    let stl = {}
    stl[action.url] = {isFetching: true, stl: ''}
    return Object.assign({}, state, {
      items: Object.assign({}, state.items, stl)
    })
  },
  [RECEIVED_STL]: (state, action) => {
    let stl = {}
    stl[action.url] = {isFetching: false, stl: action.stl}
    const newState = Object.assign({}, state, {
      items: Object.assign({}, state.items, stl)
    })
    return newState
  }
};


export default function stls(state = initialState, action) {
  const fn = actionsMap[action.type];
  if (!fn) {
    return state;
  }
  return fn(state, action);
}
