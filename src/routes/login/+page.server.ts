import { getUserByUsername, getUserId } from "$lib/server/db/dbutil";
import { validateUser, validateUsername } from "$lib/server/user/user_util";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import bcrypt from 'bcryptjs';

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString() || '';
		const password = data.get('password')?.toString() || '';

		if (!validateUsername(username, false)) {
			return fail(400, { userMessage: 'Username is invalid', userMessageC: 'error' });
		}

		if (password.length < 8 || password.length > 32) {
			return fail(400, { passMessage: 'Invalid Password', passMessageC: 'error' });
		}

		const token = bcrypt.hashSync(username.toLowerCase() + password, 10);

		if (token.length !== 60) {
			return fail(400, { passMessage: 'Token is invalid', passMessageC: 'error' });
		}

		const id = getUserId(username);
		if (!id || !validateUser(id.toString(), token)) {
			return fail(400, {
				userMessage: 'Invalid Password or username',
				userMessageC: 'error',
				passMessage: 'Invalid Password or username',
				passMessageC: 'error'
			});
		}

		const user = getUserByUsername(id);
        
		cookies.set('token', user?.user_enc || '', {
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});
		cookies.set('userID', id.toString(), {
			path: '/',
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/');
	}
};
