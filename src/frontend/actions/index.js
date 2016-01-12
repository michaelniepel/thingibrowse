import 'whatwg-fetch'; //polyfill
import { RECEIVED_DIRS, REQUEST_DIRS, REQUEST_STL, RECEIVED_STL } from '../constants';

function requestDirs() {
	return {
		type: REQUEST_DIRS
	}
}

function receivedDirs(json, splat) {
	return {
		type: RECEIVED_DIRS,
		dirs: json,
		splat: splat,
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
			.then(json => dispatch(receivedDirs(json, splat)))

	}
}

function requestStl(url) {
	return {
		type: REQUEST_STL,
		url: url
	}
}

function receivedStl(url, byteStream) {
	return {
		type: RECEIVED_STL,
		url: url,
		stl: byteStream
	}
}

export function fetchStl(url) {
	return dispatch => {
		dispatch(requestStl(url))
		return fetch('/api/models/'+url)
			.then(resp => resp.arrayBuffer())
			.then(ab => dispatch(receivedStl(url, ab)))
	}
}
