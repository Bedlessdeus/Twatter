import { addUser, getUser, getUserByUsername, getUserId, stringToUUID } from '$lib/server/db/dbutil';
import { validateUser, validateUsername } from '$lib/server/user/user_util';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    let bod = await request.json();
    if (bod.username == null || bod.token == null) return json({ message: "Malformed Body" }, { status: 400 });
    console.log(bod)

    if(!validateUsername(bod.username, false)) 
        return json({ message: "Username is invalid" }, { status: 400 });

    if(bod.token.length !== 60) 
        return json({ message: "Token is invalid" }, { status: 400});

    const id = getUserId(bod.username);

    if(id == null) return json({ message: "Invalid Password or username" }, { status: 400});
    if(!validateUser(id.toString(), bod.token))
        return json({ message: "Invalid Password or username" }, { status: 400});

    const user = getUserByUsername(id);

    return json({userID: id, token: user?.user_enc}, { status: 200 });
};