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

export function fetchDirs()  {
	return dispatch => {
		dispatch(requestDirs())
		return fetch('/api/models')
			.then(resp => resp.json())
			.then(json => dispatch({
				type: RECEIVED_DIRS,
				dirs: json
			}));

	}
}
