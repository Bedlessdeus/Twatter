import { addUser } from '$lib/server/db/dbutil';
import { validateUsername } from '$lib/server/user/user_util';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
	let bod = await request.json();
	if (bod.username == null || bod.hash == null) return json({ message: "Malformed Body" }, { status: 400 });

    if(!validateUsername(bod.username)) return json({ message: "Username is invalid or already taken" }, { status: 400 });

    if(bod.hash.length !== 60) return json({ message: "Hash is invalid" }, { status: 400});

    let hash = bcrypt.hashSync(bod.username + bod.hash + process.env.SALT, 15);

    let user = addUser(bod.username, hash);
    if(user == "INVALID") return json({ message: "Username is invalid or already taken" }, { status: 400 });
	return json({userID: user, token: hash}, { status: 200 });
};