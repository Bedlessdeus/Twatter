import { genMissingParam, issame } from '$lib/server/WebUtil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { addPost, addUser, getUser, stringToUUID } from '$lib/server/db/dbutil';
import { parse } from 'cookie';

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

export const POST: RequestHandler = async ({ request, url }) => {
	const bod = await request.json();
	if(bod.message == null ) return json({message: "No Message"}, {status: 400});
	if(bod.title == null) return json({message: "No Title"}, {status: 400})
	const cookie = parse(request.headers.get("cookie") || "")
	if(cookie.userID == null) return json({message: "Invalid User"}, {status: 400});

	if(bod.title.length > 32) return json({message: "Title is longer than 32"}, { status: 400 })

	if(bod.message.length > 128) return json({message: "Message is longer than 128"}, {status: 400 })
		
	addPost(stringToUUID(cookie.userID), bod.title, bod.message);

	return json({ status: 200 });
};
