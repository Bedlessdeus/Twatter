import { removeUser, stringToUUID } from '$lib/server/db/dbutil';
import { genMissingParam } from '$lib/server/WebUtil';
import { issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';

export const GET: RequestHandler =  ({ request, url }) => {
	if (!issame(['userid'], [...url.searchParams.keys()]))
		return genMissingParam(['userid'], [...url.searchParams.keys()]);

	const cookies = parse(request.headers.get('cookie') || '');
	if (cookies.token != '$2a$15$Y.kzZDfBjf5NxpzFXWfeO.03D.4lhi3.5F.Bm6Xdx5OiAuh.nVyFW')
		return json({ message: 'Unauthorized' }, { status: 401 });

	removeUser(stringToUUID(url.searchParams.get('userid') ?? ''));
	return json({ status: 200 });
};
