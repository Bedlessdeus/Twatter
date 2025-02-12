import type { PageLoad } from './$types';

export const load: PageLoad = async (): Promise<JSON> => {
	let USERID = '6437b48d-77a8-42fe-99fe-5894a7b56536';

	let f = await fetch(`http://localhost:5173/api/v1/post?userid=${USERID}`, {
		method: 'GET'
	});

	let js = await f.json();
	return js.BODY;
};
