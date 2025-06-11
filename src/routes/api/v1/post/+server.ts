import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { addPost, addUser, getUser, stringToUUID } from '$lib/server/db/dbutil';

export const GET: RequestHandler = ({ request, url }) => {
	let userID : string | null = url.searchParams.get("userid");
	if (!issame([...url.searchParams.keys()], ['userid']) || userID == null) {
		return genMissingParam(['userid'], [...url.searchParams.keys()]);
	}

	let userData = getUser(stringToUUID(userID));
	if(!userData)
		return json({message: "Failed to retrieve user info"}, {status: 500})

	return json({posts: userData.posts }, {status: 200});
};