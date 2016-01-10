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

export function fetchDirs(fullPath)  {
	return dispatch => {
		dispatch(requestDirs())
		// console.log(fullPath);
		fullPath = fullPath || ['/']
		let pathString = fullPath.join('/')
		return fetch('/api/models'+pathString)
			.then(resp => resp.json())
			.then(json => dispatch({
				type: RECEIVED_DIRS,
				dirs: json,
				path: fullPath
			}));

	}
}
