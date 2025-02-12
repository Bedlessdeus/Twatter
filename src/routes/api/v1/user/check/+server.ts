import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
	if (!issame(['USERNAME'], [...url.searchParams.keys()])) {
		return genMissingParam(['USERNAME'], [...url.searchParams.keys()]);
	}
	let user = url.searchParams.get('USERNAME');
	if(user == undefined) return sendMSG("U03");
	if(!/^[a-zA-Z0-9]{3,12}$/.test(user)) return sendMSG("U04");
    return sendMSG("U01");
};

const sendMSG = async (msg: string) => {
	return json({ status: 200, message: msg });
};
