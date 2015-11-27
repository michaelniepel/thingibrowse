import 'whatwg-fetch'; //polyfill
import { RECEIVED_DIRS } from '../constants';


export function fetchDirs()  {
	return dispatch => {
		fetch('/api/models')
			.then(resp => resp.json())
			.then(json => dispatch({
				type: RECEIVED_DIRS,
				dirs: json
			}));

	}
}
