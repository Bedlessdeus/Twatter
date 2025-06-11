import type { PageServerLoad } from './$types';
import type { Post } from '$lib/server/db/user';
import type { UUID } from 'crypto';
import { addPost, getPoster, getTopCPosts, getUser, stringToUUID } from '$lib/server/db/dbutil';
import { fail, redirect, type Actions } from '@sveltejs/kit';

export type ret = {
	posts: Array<CPost>;
};

export type CPost = {
	poster: UUID;
	posterUser: string;
	post: UUID;
	title: string;
	text: string;
	like: number;
	dislike: number;
};

export const load: PageServerLoad = async (): Promise<ret> => {
	return { posts: getTopCPosts() };
};

function parseCookie(cookieHeader: string) {
	const cookies: Record<string, string> = {};
	cookieHeader.split(';').forEach((cookie) => {
		const [key, ...rest] = cookie.split('=');
		if (key && rest) {
			cookies[key.trim()] = decodeURIComponent(rest.join('='));
		}
	});
	return cookies;
}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData();
		const title = form.get('title')?.toString() || '';
		const message = form.get('message')?.toString() || '';

		if (!title) return fail(400, { message: 'No Title' });
		if (!message) return fail(400, { message: 'No Message' });
		if (title.length > 32) return fail(400, { message: 'Title is longer than 32 characters' });
		if (message.length > 128)
			return fail(400, { message: 'Message is longer than 128 characters' });

		const cookieHeader = request.headers.get('cookie') || '';
		const cookies = parseCookie(cookieHeader);

		if (!cookies.userID) return fail(400, { message: 'Invalid User' });

		await addPost(stringToUUID(cookies.userID), title, message);

		throw redirect(303, '/');
	}
};
