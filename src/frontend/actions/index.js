import 'whatwg-fetch'; //polyfill
import { RECEIVED_DIRS, REQUEST_DIRS } from '../constants';

function requestDirs() {
	return {
		type: REQUEST_DIRS
	}
}

function receivedDirs() {
	return {
		type: RECEIVED_DIRS,
		dirs: json,
		receivedAt: Date.now()
	}
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export function fetchDirs(splat) {
	return dispatch => {
		dispatch(requestDirs())
		return fetch('/api/models/'+(splat !== undefined ? splat : ''))
			.then(checkStatus)
			.then(resp => resp.json())
			.then(json => dispatch({
				type: RECEIVED_DIRS,
				dirs: json,
				splat: splat
			}));

	}
}
