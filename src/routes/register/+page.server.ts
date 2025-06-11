import { fail, redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { env } from '$env/dynamic/private';
import { validateUsername } from '$lib/server/user/user_util';
import { addUser } from '$lib/server/db/dbutil';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();

		if (!username || !password) {
			return fail(400, { error: 'Malformed Body' });
		}

		if (!validateUsername(username)) {
			return fail(400, { error: 'Username is invalid or already taken' });
		}

		if (password.length < 8 || password.length > 32) {
			return fail(400, { error: 'Password length must be between 8 and 32 characters' });
		}

		const hash = bcrypt.hashSync(username.toLowerCase() + password + env.SALT, 15);

		const user = addUser(username, hash);
		if (user === 'INVALID') {
			return fail(400, { error: 'Username is invalid or already taken' });
		}

		cookies.set('token', hash, { path: '/', maxAge: 60 * 60 * 24 * 7 });
		cookies.set('userID', user, { path: '/', maxAge: 60 * 60 * 24 * 7 });

		throw redirect(303, '/');
	}
};
