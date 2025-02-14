import { addLike, hasLiked, stringToUUID } from '$lib/server/db/dbutil';
import { json, type RequestHandler } from '@sveltejs/kit';
import { parse } from 'cookie';

export const POST: RequestHandler = async ({ request }) => {
	let bod = await request.json();
	if (!(bod.method === "ADD" || bod.method === "REMOVE" || bod.method === "HAS")) {
		console.log(bod.method)
		return json({
			message: "Malformed content, no method added, please use 'ADD' or 'REMOVE' or 'HAS'"
		}, {status: 403});
	}
	
	if(bod.post == null || bod.poster == null)
		return json({
			message: "Missing post or poster"
		}, {status: 403})

	let cookieDat = request.headers.get("cookie");
	if(cookieDat == null) return json({
		message: "No cookies founder in header"
	}, {status: 403})

	let cookie = parse(cookieDat)
	if(bod.method == "ADD") {
		let like = addLike(stringToUUID(bod.poster), stringToUUID(bod.post), stringToUUID(cookie.userID));
		if(like) return json({message: "Success"}, {status: 200})
		return json({message: "Failed"},{status: 400})
	}
	
	if(bod.method == "REMOVE") {
		let like = addLike(stringToUUID(bod.poster), stringToUUID(bod.post), stringToUUID(cookie.userID));
		if(like) return json({message: "Success"}, {status: 200})
		return json({message: "Failed"}, {status: 400})
	}

	if(bod.method == "HAS") {
		let like = hasLiked(stringToUUID(bod.poster), stringToUUID(bod.post), stringToUUID(cookie.userID));
		if(like) return json({message: true}, {status: 200})
		return json({message: false}, {status: 200})
	}

	return json({ status: 405 });
};
