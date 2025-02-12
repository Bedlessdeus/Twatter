import { addUser, getUser, getUserByUsername, getUserId } from '$lib/server/db/dbutil';
import { validateUser, validateUsername } from '$lib/server/user/user_util';
import { json, type RequestHandler } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({ request }) => {
    let bod = await request.json();
    if (bod.username == null || bod.hash == null) return json({ message: "Malformed Body" }, { status: 400 });

    if(!await validateUsername(bod.username, false)) 
        return json({ message: "Username is invalid" }, { status: 400 });

    if(bod.hash.length !== 60) 
        return json({ message: "Hash is invalid" }, { status: 400});

    if(!validateUser(bod.username, bod.hash))
        return json({ message: "Invalid Password or username" }, { status: 400});

    const user = await getUserByUsername(bod.username);
    const id = await getUserId(bod.username);

    return json({userID: id, token: user?.user_enc}, { status: 200 });
};