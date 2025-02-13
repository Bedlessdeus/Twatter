import { parse } from 'cookie';
import { getUser, stringToUUID } from '$lib/server/db/dbutil';
import bcrypt from 'bcryptjs';
import { validateUser } from '$lib/server/user/user_util';
import { goto } from '$app/navigation';
import { redirect } from '@sveltejs/kit';

const allowedPaths = ['/api/v1/user/register', '/api/v1/user/login', '/api/v1/user/check', '/register', '/login'];

export async function handle({ event, resolve }) {
    const url = new URL(event.request.url);
    const path = url.pathname;

    if (allowedPaths.includes(path)) {
        return resolve(event);
    }
    const cookies = parse(event.request.headers.get('cookie') || '');
    
    let userID : undefined |  string = cookies.userID;
    let token : undefined | string = cookies.token;

    if(userID == "undefined") userID = undefined;
    if(token == "undefined") token = undefined;

    if (!userID || !token)
        throw redirect(303, '/login')

    if(userID === undefined || token === undefined || !await validateUser(userID, token)) 
        throw redirect(303, '/login')

    if(path == "/login" || path == "/register")
        throw redirect(302, '/')
    
    return resolve(event);
}