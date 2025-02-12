import { parse } from 'cookie';
import { getUser, stringToUUID } from '$lib/server/db/dbutil';
import bcrypt from 'bcryptjs';
import { validateUser } from '$lib/server/user/user_util';
import { goto } from '$app/navigation';

const allowedPaths = ['/api/v1/user/register', '/api/v1/user/login', '/api/v1/user/check', '/register', '/login'];

export async function handle({ event, resolve }) {
    const url = new URL(event.request.url);
    const path = url.pathname;

    if (allowedPaths.includes(path)) {
        return resolve(event);
    }
    const cookies = parse(event.request.headers.get('cookie') || '');
    const userId = cookies.userId;
    const userHash = cookies.userHash;
    if (!userId || !userHash) {
        return new Response('Unauthorized', { status: 401 });
    }

    /*
    // Get cookies
    const cookies = parse(event.request.headers.get('cookie') || '');
    

    // Check if cookies are present
    if (!userId || !userHash) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Get user data from the database
    const user = await getUser(stringToUUID(userId));
    if (!user) {
        return new Response('Unauthorized', { status: 401 });
    }

    // Generate hash to compare
    const dataToHash = `${user.username}:${event.request.headers.get('user-agent')}`;
    const isValidHash = await bcrypt.compare(dataToHash, user.user_enc);

    // Validate hash
    if (!isValidHash) {
        return new Response('Unauthorized', { status: 401 });
    }*/

    console.log(userId + " " + userHash);
    if(!validateUser(userId, userHash)) {
        goto('/login');
        return new Response('Unauthorized', { status: 401 });
    }

    // Proceed with the request
    return resolve(event);
}