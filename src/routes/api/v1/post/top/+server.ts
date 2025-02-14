import { getPoster, getTopCPosts, getTopPosts, getUser, stringToUUID } from '$lib/server/db/dbutil';
import type { CPost, Post } from '$lib/server/db/user';
import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ url }) => {
	if (!issame(['limit', 'offset'], [...url.searchParams.keys()]))
		return genMissingParam(['limit', 'offset'], [...url.searchParams.keys()]);

	const limit = parseInt(url.searchParams.get('limit') || '10');
	const offset = parseInt(url.searchParams.get('offset') || '0');
	console.log(limit + " " + offset)
	console.log(getTopCPosts(limit, offset))
	return json({ posts: getTopCPosts(limit, offset) }, { status: 200 });
};
