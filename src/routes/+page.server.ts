import type {  PageServerLoad } from './$types';
import type { Post } from '$lib/server/db/user';
import type { UUID } from 'crypto';
import { getPoster, getTopCPosts, getUser, stringToUUID } from '$lib/server/db/dbutil';

export type ret = {
	posts: Array<CPost>
}

export type CPost = {
	poster: UUID;
	posterUser: string;
	post: UUID;
	title: string;
	text: string;
	like: number;
	dislike: number;
}

export const load: PageServerLoad = async (): Promise<ret> => {
	return {posts: getTopCPosts()};
};
