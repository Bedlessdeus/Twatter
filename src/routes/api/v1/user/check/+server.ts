import { containsUser, containsUsername } from '$lib/server/db/dbutil';
import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	if (!issame(['username'], [...url.searchParams.keys()])) {
		return genMissingParam(['username'], [...url.searchParams.keys()]);
	}

	let user = url.searchParams.get('username');
	if(user === undefined || !/^[a-zA-Z0-9]{3,12}$/.test(user?? "") || containsUsername(user?? "")) return sendMSG(false);
    return sendMSG(true);
};

const sendMSG = (isValid: boolean) => {
	return json({ status: 200, valid: isValid });
};
